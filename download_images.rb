require 'open-uri'

def download_image(url, path)
  puts "Downloading #{url} to #{path}..."
  File.open(path, 'wb') do |file|
    file << URI.open(url).read
  end
  puts "Downloaded #{path}"
rescue => e
  puts "Failed to download #{url}: #{e.message}"
end

# Retry Hero 1
download_image("https://plus.unsplash.com/premium_photo-1673898083893-6a9c9f28c2c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", "app/assets/images/hero_1.jpg")

# Retry Categories
download_image("https://images.unsplash.com/photo-1541336032412-204896add727?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", "app/assets/images/cat_sparklers.jpg")
download_image("https://images.unsplash.com/photo-1615456208047-9d7a26421371?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", "app/assets/images/cat_rockets.jpg")
download_image("https://images.unsplash.com/photo-1510304377605-7bf2b9115302?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", "app/assets/images/cat_flowerpots.jpg")
download_image("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", "app/assets/images/cat_giftbox.jpg")
