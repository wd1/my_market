module Private
  module Withdraws
    class BatsController < ::Private::Withdraws::BaseController
      include ::Withdraws::Withdrawable
    end
  end
end
