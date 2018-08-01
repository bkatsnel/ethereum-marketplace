import { connect } from 'react-redux'
import Administrators from './Administrators'
import { addAdministrator, watchAdministrators, getAdministrators } from './AdministratorsActions'

const mapStateToProps = (state, ownProps) => {
  return {
    admins: state.admins.admins,
    loaded: state.admins.loaded,
    loading: state.admins.loading,
    watch: state.admins.watch
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (admin) => {
      dispatch(addAdministrator(admin))
    },
    onWatch: () => {
      dispatch(watchAdministrators())
    },
    onGet: () => {
      dispatch(getAdministrators())
    }
  }
}

const AdministratorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Administrators)

export default AdministratorsContainer
