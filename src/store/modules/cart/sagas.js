import {call, select, put, all, takeLatest} from 'redux-saga/effects';

import {toast} from 'react-toastify';
import api from '../../../services/api';
//import history from '../../../services/history';

import {addToCartSuccess, updateAmountSuccess} from './actions';

import {formatPrice} from '../../../util/format';


function* addToCart({id}) {
  const productExists = yield select(state =>
    state.cart.find(product => product.id === id)
  );

  const stockExists = yield call(api.get, `/stock/${id}`);

  if (stockExists) {
    const stockAmount = stockExists.data.amount;
    const cartAmount = productExists ? productExists.amount : 0;

    const amount = cartAmount + 1;

    if (amount > stockAmount) {
      toast.error('Quantidade solicitada fora de estoque.');
      return;
    }

    if (productExists) {
      yield put(updateAmountSuccess(id, amount));
    } else {
      const response = yield call(api.get, `/products/${id}`);

      const data = {
        ...response.data,
        amount: 1,
        priceFormatted: formatPrice(response.data.price),
      };

      yield put(addToCartSuccess(data));

      // history.push('/cart');
    }
  } else {
    toast.error('Produto fora de estoque.');
  }
}

function* updateAmount({id, amount}) {
  if (amount <= 0) return;

  const stockExists = yield call(api.get, `/stock/${id}`);

  if (stockExists) {
    const stockAmount = stockExists.data.amount;

    if (amount > stockAmount) {
      toast.error('Quantidade solicitada fora de estoque.');
      return;
    }
  } else {
    toast.error('Produto fora de estoque.');
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
