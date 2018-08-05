import { connect } from 'react-redux'
import PurchaseList from './PurchaseList'
import { watchPurchases, getPurchases } from './PurchaseListActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    loading: state.purchases.loading,
    loaded: state.purchases.loaded,
    purchases: state.purchases.purchases,
    watch: state.purchases.watch,
    refresh: state.purchases.refresh
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWatch: () => {
      dispatch(watchPurchases())
    },
    onGet: () => {
      dispatch(getPurchases())
    }
  }
}

const PurchaseListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseList)

export default PurchaseListContainer
