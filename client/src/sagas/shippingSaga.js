import { select, put, takeLatest } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch';

import {
    SET_CART_ITEMS,
    INCREASE_ITEM_QUANTITY,
    DECREASE_ITEM_QUANTITY,
    FETCHED,
    FETCHING,
    setShippingFetchStatus,
    setShippingCost
} from './../actions'

import { cartItemsSelector } from '../selectors'

export function* shippingSaga() {
    yield takeLatest([SET_CART_ITEMS, INCREASE_ITEM_QUANTITY, DECREASE_ITEM_QUANTITY], shipping)
}

function* shipping() {
    yield put(setShippingFetchStatus(FETCHING));
    const items = yield select(cartItemsSelector);

    const itemRequestString = items.reduce((string, item) => {
        for (let index = 0; index < item.get('quantity'); index++) {
            string += item.get(`id`) + ",";
        }
        return string;
    }, "").replace(/,\s*$/, '');

    const response = yield fetch(`http://localhost:8081/shipping/${itemRequestString}`);
    const { total } = yield response.json();
    yield put(setShippingCost(total));
    yield put(setShippingFetchStatus(FETCHED));

    console.log(`made idem request`, itemRequestString);
}