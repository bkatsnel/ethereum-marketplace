import { connect } from 'react-redux'
import PurchaseList from './PurchaseList'
import { watchPurchases } from './PurchaseListActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    loading: state.purchases.loading,
    loaded: state.purchases.loaded,
    purchases: state.purchases.purchases
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWatch: () => {
      dispatch(watchPurchases())
    }
  }
}

const PurchaseListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseList)

export default PurchaseListContainer
