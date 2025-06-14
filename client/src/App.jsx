import Table from "./Table/Table"
import { Provider } from "react-redux"
import store from "./app/store"


function App() {

  return (
    <Provider store={store}>
    <Table />
    </Provider>
  )
}

export default App
