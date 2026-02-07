content = File.read("app/views/layouts/admin.html.erb")
if content.match(/<head>.*bootstrap.bundle.min.js.*<\/head>/m)
  puts "Admin Layout: SUCCESS (Bootstrap in Head)"
else
  puts "Admin Layout: FAIL (Bootstrap NOT in Head)"
end
