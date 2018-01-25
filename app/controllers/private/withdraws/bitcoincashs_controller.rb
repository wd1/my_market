module Private
  module Withdraws
    class BitcoincashsController < ::Private::Withdraws::BaseController
      include ::Withdraws::Withdrawable
    end
  end
end
