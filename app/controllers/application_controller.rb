class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  stale_when_importmap_changes

  layout :layout_by_resource

  private

  def layout_by_resource
    if devise_controller?
      "auth"
    else
      "application"
    end
  end
end
