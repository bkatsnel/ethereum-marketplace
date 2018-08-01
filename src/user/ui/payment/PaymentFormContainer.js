import { connect } from 'react-redux'
import PaymentForm from './PaymentForm'
import { withdrawBalance } from './PaymentFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.user.name,
    id: state.user.id,
    balance: state.user.balance,
    withdrawals: state.user.withdrawals,
    store: state.owners.store,
    store_balance: state.owners.balance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWithdraw: (name) => {
      dispatch(withdrawBalance(name))
    }
  }
}

const PaymentFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentForm)

export default PaymentFormContainer
