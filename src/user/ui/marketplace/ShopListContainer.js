import { connect } from 'react-redux'
import ShopList from './ShopList'
import { watchStores } from './ShopListActions'
import { changeProductsStoreName } from '../products/ProductsFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.stores.loading,
    loaded: state.stores.loaded,
    shops: state.stores.stores
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWatch: () => {
      dispatch(watchStores())
    },
    onSelect: (name) => {
      dispatch(changeProductsStoreName(name))
    }
  }
}

const ShopListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopList)

export default ShopListContainer
