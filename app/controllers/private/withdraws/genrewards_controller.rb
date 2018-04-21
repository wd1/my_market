module Private
  module Withdraws
    class GenrewardsController < ::Private::Withdraws::BaseController
      include ::Withdraws::Withdrawable
    end
  end
end
