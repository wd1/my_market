module Private
  module Withdraws
    class GenesisvisionsController < ::Private::Withdraws::BaseController
      include ::Withdraws::Withdrawable
    end
  end
end
