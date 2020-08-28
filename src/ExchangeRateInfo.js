import React, { Component } from "react";
import axios from "axios";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


class ExchangeRateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangerates: [],
      refreshtime: 5000,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  toggleRefreshTime = (event) => {
    this.setState({refreshtime:event.target.value});
    // console.log(this.state.refreshtime);
  };
  getData = () => {
    axios
      .get(`https://liquality.io/swap/agent/api/swap/marketinfo`)
      .then((res) => {
        const exchangeratesinfo = res.data;
        // console.log(exchangeratesinfo);
        this.setState({ exchangerates: exchangeratesinfo });
        // console.log(this.state);
        this.intervalID = setTimeout(
          this.getData.bind(this),
          this.state.refreshtime
        );
      });
  };

  getColumnContent = (exchangerates) => {
    let content = [];
    for (let i = 0; i < exchangerates.length; i++) {
      const item = exchangerates[i];
      content.push(
        <TableRow>
          <TableCell key={item.id} align="right">
            {item.from}
          </TableCell>
          <TableCell key={item.id} align="right">
            {item.to}
          </TableCell>
          <TableCell key={item.id} align="right">
            {item.rate}
          </TableCell>
        </TableRow>
      );
    }
    return content;
  };

  render() {
    return (
      <div className="exchangerateinfo">
        <div className="exchangerateinfo__heading">
          <h1 className="exchangerateinfo__heading">Liquality Market Info</h1>
        </div>
        <div className="exchangerateinfo__actionarea">
          <FormControl variant="outlined" className="exchangerateinfo__actionarea__formcontrol">
            <InputLabel htmlFor="outlined-age-native-simple">
              Refresh Time
            </InputLabel>
            <Select
              native
              value={this.state.refreshtime}
              onChange={this.toggleRefreshTime}
              label="Refresh Time"
            >
              <option aria-label="None" value="" />
              <option value={5000}>5 Seconds</option>
              <option value={10000}>10 Seconds</option>
              <option value={15000}>15 Seconds</option>
            </Select>
          </FormControl>
        </div>

        <div className="exchangerateinfo__table">
          <TableContainer component={Paper} style={{border:"1px solid #C4C4C4"}}>
            <Table className="exchangeinfo__table"style={{ minWidth: 650}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right" style={{backgroundColor:"#F1F4F7", fontWeight:'bold'}}>From</TableCell>
                  <TableCell align="right" style={{backgroundColor:"#F1F4F7", fontWeight:'bold'}}>To</TableCell>
                  <TableCell align="right" style={{backgroundColor:"#F1F4F7", fontWeight:'bold'}}>Exchange Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.getColumnContent(this.state.exchangerates)}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
}
export default ExchangeRateInfo;
