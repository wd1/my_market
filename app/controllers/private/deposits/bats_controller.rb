module Private
  module Deposits
    class BatsController < ::Private::Deposits::BaseController
      include ::Deposits::CtrlCoinable
    end
  end
end
