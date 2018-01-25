module Private
  module Deposits
    class ArguesController < ::Private::Deposits::BaseController
      include ::Deposits::CtrlCoinable
    end
  end
end
