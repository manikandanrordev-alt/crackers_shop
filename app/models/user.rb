class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :role, { customer: 0, admin: 1 }
  has_many :orders
  
  after_initialize :set_default_role, if: :new_record?

  def set_default_role
    self.role ||= :customer
    self.points ||= 0
  end
end
