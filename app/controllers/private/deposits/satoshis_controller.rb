module Private
  module Deposits
    class SatoshisController < ::Private::Deposits::BaseController
      puts "satoshicontroller"
      include ::Deposits::CtrlCoinable
    end
  end
end
