module Private
  module Withdraws
    class ArguesController < ::Private::Withdraws::BaseController
      include ::Withdraws::Withdrawable
    end
  end
end
