import { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBTableBody,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';

const OrderList = () => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [sortvalue, setSortvalue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(10);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");
  const sortOption = ["name","product", "address", "email", "phone", "status","orderdate"]; 



  useEffect(() => {
    loadUsersData(0, 10, 0, operation);
  }, []);

  const loadUsersData = async (start, end, increase, optType = null, filterOrSortValue) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setSortvalue("");
        return await axios
          .get(`http://localhost:5000/users?q=${value}&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
            // setValue("");
          })
          .catch((err) => console.log(err));
      case "sort":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(`http://localhost:5000/users?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      case "filter":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(`http://localhost:5000/users?status=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
          })
          .catch((err) => console.log(err));
      default:
        return await axios
          .get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));

    }


  };

  console.log(data);


  const handelSortOption = async (e) => {
    let value = e.target.value;
    setSortvalue(value);
    loadUsersData(0, 10, 0, "sort", value);
    // setSortvalue(setValue);
    // return await axios
    //   .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((err) => console.log(err));
  }
  const handelSearch = async (e) => {
    e.preventDefault();
    setOperation("search");
    setCurrentPage(0);
    loadUsersData(0, 10, 0, "search")
    // return await axios
    //   .get(`http://localhost:5000/users?q=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setValue("");
    //   })
    //   .catch((err) => console.log(err))
  }
  const handelReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortvalue("");
    loadUsersData(0, 10, 0);
    // alert("OK SERACH btn")
  }

  const handelFilter = async (value) => {

    // handelFilter(value);
    loadUsersData(0, 10, 0, "filter", value);
    // return await axios
    //   .get(`http://localhost:5000/users?status=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((err) => console.log(err));
  }

  // render pagination 
  const renderPagination = () => {
    if (data.length < 10 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="md-0">

          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData(10, 20, 1, operation, sortFilterValue)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>

        </MDBPagination>
      );
    }
    else if ((currentPage < (pageLimit - 1)) && (data.length === pageLimit)) {
      return (
        <MDBPagination className="md-0">

          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData((currentPage - 1) * 10, currentPage * 10, -1, operation, sortFilterValue)}>Prev</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData((currentPage + 1) * 10, (currentPage + 2) * 10, 1, operation, sortFilterValue)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>

        </MDBPagination>
      );
    }
    else {
      return (
        <MDBPagination className="md-0">

          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData((currentPage - 1) * 10, currentPage * 10, -1, operation, sortFilterValue)}>
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>


        </MDBPagination>
      )
    }
  };

  return (
    <MDBContainer>
      <form style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "400px",
        alignContent: "center",
      }}
        className="d-flex input-group w-auto"
        onSubmit={handelSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {/* <MDBBtnGroup> */}
        <MDBBtn type="submit" color='success' active>Search</MDBBtn>
        <MDBBtn className="mx-2" color='danger' onClick={handelReset}>Reset</MDBBtn>
        {/* </MDBBtnGroup> */}

      </form>
      <div style={{ marginTop: "100px" }}>
        <h2 className="text-center">Order List</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">Order Id.</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableHead className="align-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">No Data Found</td>
                  </tr>
                </MDBTableHead>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <td scope="row">{index + 1}</td>

                      <td >{item.name}</td>
                      <td >{item.product}</td>
                      <td >{item.email}</td>
                      <td >{item.phone}</td>
                      <td >{item.address}</td>
                      <td >{item.orderdate}</td>
                      <td >{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>

      </div>
      <div style={
        {
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
          justifyContent: "center",
        }
      }>{renderPagination()}</div>
      <MDBRow>
        <MDBCol size={8}>
          <h4>Sort By :</h4>
          <select
            style={{ width: "50%", borderRadius: "2px", height: " 35px" }}
            onChange={handelSortOption}
            value={sortvalue}

          >
            <option>Please Select Value</option>
            {
              sortOption.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))
            }
          </select>
        </MDBCol>
        <MDBCol size={4}>
          <h4>Filter By Status</h4>
          <MDBBtnGroup>
            <MDBBtn
              color="success"
              onClick={() => handelFilter('completed')}
            >completed</MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => handelFilter('on the way')}
              style={{ marginLeft: "2px" }}
            >on the way</MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default OrderList;
