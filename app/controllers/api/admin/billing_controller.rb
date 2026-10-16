module Api
  module Admin
    class BillingController < BaseController
      before_action :ensure_admin!, only: [:checkout]

      def search_products
        query = params[:query].to_s.strip.downcase
        products = Product.all

        if query.present?
          products = products.where(
            "LOWER(code) = :exact OR LOWER(code) LIKE :like_q OR LOWER(name) LIKE :like_q OR LOWER(category) LIKE :like_q",
            exact: query,
            like_q: "%#{query}%"
          )
          exact_sql = ActiveRecord::Base.connection.quote(query)
          products = products.order(Arel.sql("CASE WHEN LOWER(code) = #{exact_sql} THEN 0 ELSE 1 END"), :code, :name)
        else
          products = products.order(:code, :name)
        end

        products = products.limit(100)

        render json: {
          products: products.map { |p| product_payload(p) }
        }
      end

      def checkout
        customer_email = params[:customer_email].to_s.strip.presence ||
                         (params[:customer_phone].present? ? "pos_#{params[:customer_phone].gsub(/\D/, '')}@rakshcrackers.com" : "walkin_#{SecureRandom.hex(4)}@rakshcrackers.com")

        user = User.find_or_create_by(email: customer_email) do |u|
          u.password = SecureRandom.hex(10)
          u.role = :customer
        end

        items = params[:items] || []
        if items.empty?
          return render json: { success: false, error: "No items in bill" }, status: :unprocessable_entity
        end

        order = nil
        Order.transaction do
          discount_pct = params[:discount_percentage].to_f.clamp(0, 100)

          order = Order.create!(
            user: user,
            status: :completed,
            payment_method: params[:payment_method] || :cash,
            total_amount: 0,
            customer_name: params[:customer_name].presence || "Walk-in Customer",
            customer_phone: params[:customer_phone].presence || "",
            customer_address: params[:customer_address].presence || "Counter Sale",
            discount_percentage: discount_pct
          )

          total_sum = 0
          items.each do |item|
            product = Product.find(item[:id] || item[:product_id])
            quantity = item[:quantity].to_i
            quantity = 1 if quantity <= 0

            order.order_items.create!(
              product: product,
              quantity: quantity,
              price: product.price
            )

            product.decrement!(:stock_quantity, quantity)
            total_sum += (product.price.to_f * quantity)
          end

          discount_amount = total_sum * (discount_pct / 100.0)
          order.update_columns(
            discount: discount_amount,
            total_amount: (total_sum - discount_amount).round(2)
          )
        end

        shop = ShopConfig.first
        render json: {
          success: true,
          message: "Bill generated successfully",
          invoice: {
            order_id: order.id,
            shop_name: shop&.shop_name || "Raksh Crackers",
            date: order.created_at.strftime("%d-%m-%Y %I:%M %p"),
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            payment_method: order.payment_method.to_s.upcase,
            items: order.order_items.map do |oi|
              {
                name: oi.product.name,
                category: oi.product.category,
                quantity: oi.quantity,
                unit_price: oi.price.to_f,
                subtotal: (oi.price.to_f * oi.quantity).round(2)
              }
            end,
            subtotal: order.order_items.sum { |oi| oi.price.to_f * oi.quantity }.round(2),
            discount_percentage: order.discount_percentage.to_f,
            discount_amount: order.discount.to_f,
            total_amount: order.total_amount.to_f
          }
        }
      rescue => e
        render json: { success: false, error: e.message }, status: :unprocessable_entity
      end

      def tts
      text = params[:text].to_s.strip
      return head :bad_request if text.blank?

      require "net/http"
      require "uri"

      encoded_q = URI.encode_www_form_component(text)
      uri = URI("https://translate.google.com/translate_tts?ie=UTF-8&q=#{encoded_q}&tl=ta&client=tw-ob")

      req = Net::HTTP::Get.new(uri)
      req["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      if res.is_a?(Net::HTTPSuccess)
        send_data res.body, type: "audio/mpeg", disposition: "inline"
      else
        head :not_found
      end
    rescue => e
      Rails.logger.error("TTS error: #{e.message}")
      head :internal_server_error
    end

    def ai_parse
      raw_text = params[:query].to_s.strip
      cart_items = params[:cart] || []
      current_discount = params[:discount].to_f

      if raw_text.blank?
        return render json: { success: false, error: "Empty voice query" }, status: :unprocessable_entity
      end

      text = raw_text.downcase

      # 1. Clear Bill Check
      if text.match?(/(clear|reset bill|new bill|அழி|புது பில்|கிளியர்)/i)
        speech = "பில் அழிக்கப்பட்டது. புதிய பில் தொடங்கலாம்."
        return render json: {
          success: true,
          action: "clear",
          feedback: "🗑️ பில் அழிக்கப்பட்டது",
          speech_text: speech,
          audio_url: "/api/admin/billing/tts?text=#{URI.encode_www_form_component(speech)}"
        }
      end

      # Tamil numbers dictionary
      tamil_nums = {
        "onnu" => 1, "ondru" => 1, "onnum" => 1, "oru" => 1,
        "rendu" => 2, "irandu" => 2, "rendum" => 2,
        "moonu" => 3, "moondru" => 3, "moonum" => 3,
        "naalu" => 4, "naangu" => 4, "naalum" => 4,
        "anju" => 5, "aindhu" => 5, "ainthu" => 5, "anjum" => 5,
        "aaru" => 6, "aarum" => 6,
        "ezhu" => 7, "yelu" => 7, "ezhum" => 7,
        "ettu" => 8, "ettum" => 8,
        "onbadhu" => 9, "onbathu" => 9, "ombadhu" => 9,
        "pathu" => 10, "pathum" => 10,
        "padhanju" => 15, "pathinanju" => 15,
        "iruvadhu" => 20, "irubadhu" => 20,
        "aimbadhu" => 50, "ambadhu" => 50,
        "nooru" => 100,
        "ஒன்று" => 1, "ஒன்னு" => 1, "ஒரு" => 1,
        "இரண்டு" => 2, "ரெண்டு" => 2,
        "மூன்று" => 3, "மூணு" => 3,
        "நான்கு" => 4, "நாலு" => 4,
        "ஐந்து" => 5, "அஞ்சு" => 5,
        "ஆறு" => 6, "ஏழு" => 7, "எட்டு" => 8, "ஒன்பது" => 9, "பத்து" => 10,
        "பதினைந்து" => 15, "இருபது" => 20, "ஐம்பது" => 50, "நூறு" => 100,
        "one" => 1, "two" => 2, "three" => 3, "four" => 4, "five" => 5,
        "six" => 6, "seven" => 7, "eight" => 8, "nine" => 9, "ten" => 10,
        "fifteen" => 15, "twenty" => 20, "fifty" => 50, "hundred" => 100
      }

      # 2. Total / Discount / Complete / Read / Revise Check
      # Matches: "அவ்வளவுதான் இதை கால்குலேட் பண்ணி 80% டிஸ்கவுன்ட் பண்ணி டோட்டல் அமௌன்ட் போடு",
      # "finish", "முடிஞ்சது", "திரும்ப ரீட் பண்ணி காமி", "ரிவைஸ் பண்ணு", "80% discount" etc.
      is_total = text.match?(/(avlodhan|avalthan|avlodha|அவ்வளவுதான்|அவ்ளோதான்|போதும்|complete|finish|பினிஷ்|முடிஞ்ச|முடிந்தது|முடிஞ்சுது|முடிச்சுடு|calculate|கால்குலேட்|கணக்கு|total|டோட்டல்|மொத்தம்|மொத்த|discount|டிஸ்கவுன்ட்|டிஸ்கவுண்ட்|தள்ளுபடி|read|ரீட்|revise|ரிவைஸ்|படி|படிச்சு)/i)

      if is_total
        disc_match = text.match(/(\d+)\s*(?:%|percent|percentage|சதவீதம்|சதவீத|தள்ளுபடி|டிஸ்கவுண்ட்|டிஸ்கவுன்ட்|discount)/i) ||
                     text.match(/(?:discount|டிஸ்கவுண்ட்|டிஸ்கவுன்ட்|தள்ளுபடி)\s*(\d+)/i) ||
                     text.match(/(\d+)\s*%/i)

        effective_discount = if disc_match
          disc_match[1].to_i.clamp(0, 100)
        else
          found_pct = nil
          tamil_nums.each do |w, n|
            if text.match?(/(?:^|\s)#{Regexp.escape(w)}\s*(?:%|percent|percentage|சதவீதம்|டிஸ்கவுண்ட்|டிஸ்கவுன்ட்)/i)
              found_pct = n
              break
            end
          end
          found_pct || current_discount
        end

        subtotal = cart_items.sum { |i| (i[:price].to_f * (i[:quantity].to_i > 0 ? i[:quantity].to_i : 1)) }
        discount_amt = (subtotal * (effective_discount / 100.0)).round
        final_payable = [0, (subtotal - discount_amt).round].max
        total_items = cart_items.sum { |i| i[:quantity].to_i > 0 ? i[:quantity].to_i : 1 }

        is_read_or_revise = text.match?(/(read|ரீட்|revise|ரிவைஸ்|படி|படிச்சு|விவரம்|லிஸ்ட்|என்னென்ன)/i) || text.match?(/(அவ்வளவுதான்|முடிஞ்ச|பினிஷ்|complete)/i)

        speech = if cart_items.empty?
          "பில்லில் இன்னும் எந்த பட்டாசும் சேர்க்கப்படவில்லை. முதலில் பொருட்களை சேர்க்கவும்."
        elsif is_read_or_revise && cart_items.any?
          items_list = cart_items.map do |ci|
            raw_n = ci[:name].to_s.gsub(/\(.*\)/, "").strip
            q = ci[:quantity].to_i > 0 ? ci[:quantity].to_i : 1
            tn = case raw_n
            when /10 cm.*Sparkler/i then "10 சென்டிமீட்டர் மத்தாப்பு கம்பி"
            when /15 cm.*Sparkler/i then "15 சென்டிமீட்டர் மத்தாப்பு கம்பி"
            when /30 cm.*Sparkler/i then "30 சென்டிமீட்டர் மத்தாப்பு கம்பி"
            when /50 cm.*Sparkler/i then "50 சென்டிமீட்டர் மெகா மத்தாப்பு கம்பி"
            when /Chakkar Deluxe/i then "டீலக்ஸ் சக்கரம்"
            when /Chakkar/i then "தர சக்கரம்"
            when /Musical Wheel/i then "மியூசிகல் சக்கரம்"
            when /Flower Pot/i then "பூந்தொட்டி பூச்சட்டி"
            when /Missile Rocket/i then "மிசைல் ராக்கெட்"
            when /Aerial Pearl Cake|12-Shot/i then "12 ஷாட் வானவெடி"
            else
              raw_n
            end
            "#{tn} #{q} பாக்ஸ்"
          end.join(", ")

          if effective_discount > 0
            "பில் விவரம்: #{items_list}. மொத்தம் #{total_items} பொருட்கள். #{effective_discount.to_i} சதவீத தள்ளுபடி போக, நீங்கள் செலுத்த வேண்டிய மொத்த தொகை ரூபாய் #{final_payable}."
          else
            "பில் விவரம்: #{items_list}. மொத்தம் #{total_items} பொருட்கள். நீங்கள் செலுத்த வேண்டிய மொத்த தொகை ரூபாய் #{final_payable}."
          end
        elsif effective_discount > 0
          "அவ்வளவுதான்! மொத்தம் #{total_items} பொருட்கள். #{effective_discount.to_i} சதவீத தள்ளுபடி போக, நீங்கள் செலுத்த வேண்டிய மொத்த தொகை ரூபாய் #{final_payable}."
        else
          "அவ்வளவுதான்! மொத்தம் #{total_items} பொருட்கள். நீங்கள் செலுத்த வேண்டிய மொத்த தொகை ரூபாய் #{final_payable}."
        end

        return render json: {
          success: true,
          action: "total",
          discount_percentage: effective_discount,
          total_items: total_items,
          final_payable: final_payable,
          feedback: "💰 மொத்தம்: ₹#{final_payable} (#{total_items} பொருட்கள்#{effective_discount > 0 ? ", #{effective_discount.to_i}% தள்ளுபடி" : ""})",
          speech_text: speech,
          audio_url: "/api/admin/billing/tts?text=#{URI.encode_www_form_component(speech)}"
        }
      end

      # 3. Add or Remove Cracker Product
      is_remove = text.match?(/(remove|delete|cancel|நீக்கு|வேண்டாம்|venam|தூக்கு|எடு)/i)

      # Step A: Tamil Fireworks Concept Normalizer & Semantic Translator
      # Translates Tamil, Tanglish, and Sivakasi cracker terms into standard English cracker search concepts
      tamil_semantic_map = {
        /சென்டிமீட்டர்|சென்டிமீட்டரா|செமீ|செ\.மீ/ => "cm",
        /இன்ச்|இன்சஸ்|இஞ்சி|இஞ்சு|இஞ்ச்/ => "inch",
        /மில்லிமீட்டர்|மிமீ/ => "mm",
        /அடி|பீட்/ => "feet",
        /ஷாட்|ஷாட்ஸ்|ஷாட்கள்/ => "shot",
        /வாலா|வாலாஸ்/ => "wala",
        /மெகா/ => "mega",
        /ஜாயிண்ட்|ஜயன்ட்|ஜெயன்ட்|ஜயண்ட்/ => "giant",
        /கம்பி|மத்தாப்பு|மின்மினி/ => "sparkler",
        /எலக்ட்ரிக்|எலக்ட்ரிக்கல்/ => "electric",
        /பைப்|வானவெடி|வான\s*வெடி|ஆகாய\s*வெடி|ஸ்கை\s*ஷாட்/ => "pipe sky shot aerial",
        /பூச்சட்டி|பூந்தொட்டி|பவுண்டன்/ => "flower pot fountain",
        /சக்கரம்|தர\s*சக்கரம்|தரை\s*சக்கரம்|சுழல்/ => "chakkar wheel",
        /மியூசிகல்|சங்கீத|இசை/ => "musical",
        /சரவெடி|சர\s*வெடி|வாலா\s*வெடி/ => "garland string wala",
        /ராக்கெட்|மிசைல்/ => "rocket missile",
        /பாம்|ஆட்டம்\s*பாம்|வெடி/ => "bomb sound explosion",
        /பிஜிலி/ => "bijili",
        /டீலக்ஸ்/ => "deluxe",
        /ஸ்பெஷல்/ => "special",
        /கிங்|பெரிய/ => "king",
        /ஜம்போ/ => "jumbo",
        /கலர்|வண்ண/ => "colour",
        /கிராக்லிங்/ => "crackling",
        /வாட்டர்பால்|அருவி/ => "waterfall shower",
        /கோல்டன்|தங்க/ => "golden",
        /ஒன்று|ஒன்னு|ஒரு\b/ => " 1 ",
        /இரண்டு|ரெண்டு/ => " 2 ",
        /மூன்று|மூணு/ => " 3 ",
        /நான்கு|நாலு/ => " 4 ",
        /ஐந்து|அஞ்சு/ => " 5 ",
        /ஆறு/ => " 6 ", /ஏழு/ => " 7 ", /எட்டு/ => " 8 ", /ஒன்பது/ => " 9 ", /பத்து/ => " 10 ",
        /பதினைந்து|பதினாஞ்சு|பதினஞ்சு/ => " 15 ",
        /இருபது/ => " 20 ", /முப்பது/ => " 30 ", /ஐம்பது|அம்பது/ => " 50 ", /நூறு/ => " 100 ",
        /\banju\b/ => " 5 ", /\brendu\b/ => " 2 ", /\bmoonu\b/ => " 3 ", /\bnaalu\b/ => " 4 ", /\bonnu\b/ => " 1 "
      }

      normalized = text.dup
      tamil_semantic_map.each { |re, rep| normalized.gsub!(re, " #{rep} ") }
      normalized = normalized.gsub(/\s+/, " ").strip

      # Step B: Direct Product Code Search (e.g. 101-la, code 101, 104)
      matched_product = nil
      matched_token = nil

      words = normalized.split(/\s+/)
      words.each do |w|
        clean_code = w.gsub(/(-la|-le|-oda|-ode|-ku|-ukku|la|le|oda|ode|ku|ukku|ல்|ல|க்கு|லேயும்|லையும்|-ல்|-ல|-க்கு)\z/i, "").gsub(/[^a-z0-9]/i, "")
        if clean_code.present?
          prod = Product.find_by("LOWER(code) = ?", clean_code.downcase)
          prod ||= Product.find_by(id: clean_code.to_i) if clean_code.match?(/\A\d+\z/)
          if prod
            matched_product = prod
            matched_token = w
            break
          end
        end
      end

      # Step C: Extract dimensions (e.g. 50 cm, 10 cm, 2 inch, 12 shot, 1000 wala)
      dims = []
      normalized.scan(/\b(\d+)\s*(cm|inch|shot|wala|mm)\b/i) { |num, unit| dims << "#{num} #{unit}" }

      # Step D: Precise Quantity Extraction (dimension numbers are excluded from order qty)
      text_for_qty = normalized.dup
      if matched_product
        text_for_qty.gsub!(matched_token, " ") if matched_token
        text_for_qty.gsub!(/\b#{Regexp.escape(matched_product.code)}\S*/i, " ") if matched_product.code.present?
      end

      dims.each do |d|
        d_parts = d.split
        num = d_parts[0]
        unit = d_parts[1]
        text_for_qty.gsub!(/\b#{num}\s*#{unit}\b/i, " ")
      end
      text_for_qty.gsub!(/\b(add|put|give|box|boxes|packet|pcs|piece|pieces|item|remove|delete|cancel|pannu|podu|kudu|ser|eduthuko|venam|பாக்ஸ்|பாக்கெட்|பீஸ்)\b/i, " ")

      qty = 1
      digit_matches = text_for_qty.scan(/\b(\d+)\b/).flatten
      if digit_matches.any?
        val = digit_matches.first.to_i
        qty = val if val > 0
      end

      # Step E: High-Precision Semantic Scoring against entire catalog (if not matched by code)
      unless matched_product
        tokens = normalized.split(/\s+/).reject { |t| t.length < 2 || t =~ /^(add|pannu|podu|kudu|ser|la|le|ku|the|in|cm|inch)$/i }

        all_products = Product.all.to_a
        scored = all_products.map do |p|
          p_text = "#{p.code} #{p.name} #{p.category} #{p.description}".downcase
          score = 0

          # Dimension match & penalty for dimension mismatch
          dims.each do |d|
            d_parts = d.split
            d_num = d_parts[0]
            d_unit = d_parts[1]
            if p_text.include?("#{d_num} #{d_unit}") || p_text.include?("#{d_num}#{d_unit}")
              score += 45
            elsif p_text =~ /\b\d+\s*cm\b/ && d_unit == "cm"
              score -= 50
            end
          end

          # Token match scoring
          tokens.each do |t|
            if p.name.to_s.downcase.include?(t)
              score += 15
            elsif p.category.to_s.downcase.include?(t)
              score += 10
            elsif p.description.to_s.downcase.include?(t)
              score += 3
            end
          end

          [p, score]
        end

        scored.sort_by! { |p, s| -s }
        best_p, best_s = scored.first

        if best_p && best_s >= 20
          matched_product = best_p
        end
      end

      if matched_product
        feedback = if is_remove
          "❌ #{matched_product.name} (Code: #{matched_product.code || matched_product.id}) பில்லில் இருந்து நீக்கப்பட்டது"
        else
          "✅ #{matched_product.name} (Code: #{matched_product.code || matched_product.id}) x #{qty} சேர்க்கப்பட்டது"
        end

        # Do NOT speak audio every time an item is added, keeping fast continuous billing silent and smooth!
        render json: {
          success: true,
          action: is_remove ? "remove" : "add",
          product: product_payload(matched_product),
          quantity: qty,
          feedback: feedback,
          speech_text: nil,
          audio_url: nil
        }
      else
        render json: {
          success: false,
          error: "Cracker not found for '#{raw_text}'",
          feedback: "⚠️ கண்டுபிடிக்க முடியவில்லை: '#{raw_text}'",
          speech_text: nil,
          audio_url: nil
        }
      end
    end
  end
end
end
