require 'fileutils'

# Helpers
def safe_copy(src, dest)
  if File.exist?(src)
    FileUtils.cp(src, dest)
    puts "Copied #{src} to #{dest}"
  else
    puts "Source #{src} not found!"
  end
end

# Ensure we have a hero_1
unless File.exist?("app/assets/images/hero_1.jpg")
  # Try hero_2, then hero_3, then hero_bg.png
  if File.exist?("app/assets/images/hero_2.jpg")
    safe_copy("app/assets/images/hero_2.jpg", "app/assets/images/hero_1.jpg")
  elsif File.exist?("app/assets/images/hero_3.jpg")
    safe_copy("app/assets/images/hero_3.jpg", "app/assets/images/hero_1.jpg")
  elsif File.exist?("app/assets/images/hero_bg.png")
    safe_copy("app/assets/images/hero_bg.png", "app/assets/images/hero_1.jpg")
  end
end

# Fill Category Images
# We have cat_giftbox.jpg valid. Use it or hero images for others if missing.
fallback_cat = "app/assets/images/cat_giftbox.jpg"
fallback_hero = "app/assets/images/hero_2.jpg"

[ 'cat_sparklers.jpg', 'cat_rockets.jpg', 'cat_flowerpots.jpg', 'cat_crackers.jpg' ].each do |img|
  dest = "app/assets/images/#{img}"
  next if File.exist?(dest)

  if File.exist?(fallback_cat)
    safe_copy(fallback_cat, dest)
  elsif File.exist?(fallback_hero)
    safe_copy(fallback_hero, dest)
  end
end
