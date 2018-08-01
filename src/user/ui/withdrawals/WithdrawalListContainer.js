import { connect } from 'react-redux'
import WithdrawalList from './WithdrawalList'
import { watchWithdrawals } from './WithdrawalListActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    loading: state.withdrawals.loading,
    loaded: state.withdrawals.loaded,
    withdrawals: state.withdrawals.withdrawals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWatch: () => {
      dispatch(watchWithdrawals())
    }
  }
}

const WithdrawalListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WithdrawalList)

export default WithdrawalListContainer
