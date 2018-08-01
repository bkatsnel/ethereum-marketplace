import { connect } from 'react-redux'
import OrderForm from './OrderForm'
import { placeOrder } from './OrderFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.order.name,
    id: state.order.id,
    available: state.order.available,
    price: state.order.price,
    description: state.order.description
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPlace: (name, id, quantity, price, description) => {
      dispatch(placeOrder(name, id, quantity, price, description))
    },

  }
}

const OrderFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderForm)

export default OrderFormContainer
