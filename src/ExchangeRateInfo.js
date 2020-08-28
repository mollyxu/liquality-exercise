import React, { Component } from "react";
import axios from "axios";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

class ExchangeRateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeRates: [],
      refreshTime: 5000,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  toggleRefreshTime = (event) => {
    this.setState({ refreshTime: event.target.value });
  };
  getData = () => {
    axios
      .get(`https://liquality.io/swap/agent/api/swap/marketinfo`)
      .then((res) => {
        const exchangeRatesInfo = res.data;
        this.setState({ exchangeRates: exchangeRatesInfo });
        this.intervalID = setTimeout(
          this.getData.bind(this),
          this.state.refreshTime
        );
      });
  };

  getRowContent = (exchangeRates) => {
    let content = [];
    for (let i = 0; i < exchangeRates.length; i++) {
      const item = exchangeRates[i];
      content.push(
        <TableRow key={i}>
          <TableCell align="right">{item.from}</TableCell>
          <TableCell align="right">{item.to}</TableCell>
          <TableCell align="right">{item.rate}</TableCell>
        </TableRow>
      );
    }
    return content;
  };

  render() {
    return (
      <div className="exchangerateinfo">
        <h1 className="exchangerateinfo__heading">Liquality Market Info</h1>
        <div className="exchangerateinfo__actionarea">
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">
              Refresh Time
            </InputLabel>
            <Select
              native
              value={this.state.refreshTime}
              onChange={this.toggleRefreshTime}
              label="Refresh Time"
            >
              <option value={5000}>5 Seconds</option>
              <option value={10000}>10 Seconds</option>
              <option value={15000}>15 Seconds</option>
            </Select>
          </FormControl>
        </div>

        <TableContainer
          component={Paper}
          style={{ border: "1px solid #C4C4C4" }}
        >
          <Table style={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="right"
                  style={{ backgroundColor: "#F1F4F7", fontWeight: "bold" }}
                >
                  From
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: "#F1F4F7", fontWeight: "bold" }}
                >
                  To
                </TableCell>
                <TableCell
                  align="right"
                  style={{ backgroundColor: "#F1F4F7", fontWeight: "bold" }}
                >
                  Exchange Rate
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.getRowContent(this.state.exchangeRates)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
export default ExchangeRateInfo;
