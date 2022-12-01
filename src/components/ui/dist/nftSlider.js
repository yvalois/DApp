'use strict';
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
exports.__esModule = true;
var swiper_1 = require('swiper');
var react_1 = require('swiper/react');
var nft_card_1 = require('@/components/ui/nft-card');
var react_redux_1 = require('react-redux');
var blockchainAction_1 = require('../../redux/Blockchain/blockchainAction');
var styled_components_1 = require('styled-components');
function NftSlider(_a) {
  var nfts = _a.nfts,
    priceFormat = _a.priceFormat,
    nftInfo = _a.nftInfo,
    setNftInfo = _a.setNftInfo,
    type = _a.type;
  var sliderBreakPoints = {
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1080: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1700: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    2200: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  };
  var Button = styled_components_1['default'].button(
    templateObject_1 ||
      (templateObject_1 = __makeTemplateObject(
        [
          '\n  background: #000;\n  border: none;\n  border-radius: 16px;\n  color: #fff;\n  font-size: 14px;\n  font-weight: 600;\n  padding: 5px 20px;\n  text-transform: uppercase;\n  transition: all 0.1s ease-in-out;\n  cursor: pointer;\n  &:hover {\n    background: #fff;\n    color: #000;\n  }\n',
        ],
        [
          '\n  background: #000;\n  border: none;\n  border-radius: 16px;\n  color: #fff;\n  font-size: 14px;\n  font-weight: 600;\n  padding: 5px 20px;\n  text-transform: uppercase;\n  transition: all 0.1s ease-in-out;\n  cursor: pointer;\n  &:hover {\n    background: #fff;\n    color: #000;\n  }\n',
        ]
      ))
  );
  var isConnect = react_redux_1.useSelector(function (state) {
    return state.blockchain;
  }).isConnect;
  var dispatch = react_redux_1.useDispatch();
  return React.createElement(
    'div',
    null,
    isConnect &&
      React.createElement(
        react_1.Swiper,
        {
          modules: [swiper_1.Scrollbar, swiper_1.A11y],
          spaceBetween: 24,
          slidesPerView: 1,
          scrollbar: { draggable: true },
          breakpoints: sliderBreakPoints,
          observer: true,
          dir: 'ltr',
        },
        nfts.map(function (nfts) {
          return React.createElement(
            react_1.SwiperSlide,
            { key: nfts.id },
            React.createElement(nft_card_1['default'], {
              key: nfts.nombre,
              name: nfts.nombre,
              image: nfts.img,
              price: nfts.precio,
              number: nfts.id,
              alldata: false,
              type: type,
              nftInfo: nftInfo,
              setNftInfo: setNftInfo,
            })
          );
        })
      ),
    !isConnect &&
      React.createElement(
        'div',
        {
          className:
            'w-full  flex justify-center h-[375px]  items-center bg-gray-200',
        },
        React.createElement(
          Button,
          {
            className: 'self-center',
            onClick: function () {
              dispatch(blockchainAction_1.connectWallet());
            },
          },
          'Connect Wallet'
        )
      )
  );
}
exports['default'] = NftSlider;
var templateObject_1;
