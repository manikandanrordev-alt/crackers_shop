class HomeController < ApplicationController
  def index
    dist_index = Rails.root.join("public/dist/index.html")
    if File.exist?(dist_index)
      render file: dist_index, layout: false, content_type: "text/html"
    else
      render plain: "Please run 'npm run build' inside client/ to compile the React frontend.", status: :ok
    end
  end
end
