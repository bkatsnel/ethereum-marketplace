import { connect } from 'react-redux'
import PriceForm from './PriceForm'
import { watchPrice } from './PriceFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    balance: state.price.balance,
    usd: state.price.usd,
    owner: state.price.owner,
    msg: state.price.msg,
    loading:state.price.loading,
    loaded:state.price.loaded,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWatch: () => {
      dispatch(watchPrice())
    }
  }
}

const PriceFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceForm)

export default PriceFormContainer
