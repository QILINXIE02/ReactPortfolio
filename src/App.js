import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import $ from "jquery";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Home from "./components/Home";

class App extends Component {
  state = {
    foo: "bar",
    resumeData: {},
    sharedData: {},
  };

  componentDidMount() {
    this.loadSharedData();
    this.applyPickedLanguage(window.$primaryLanguage, window.$secondaryLanguageIconId);
  }

  applyPickedLanguage = (pickedLanguage, oppositeLangIconId) => {
    this.swapCurrentlyActiveLanguage(oppositeLangIconId);
    document.documentElement.lang = pickedLanguage;
    const resumePath = pickedLanguage === window.$primaryLanguage ? 'res_primaryLanguage.json' : 'res_secondaryLanguage.json';
    this.loadResumeFromPath(resumePath);
  }

  swapCurrentlyActiveLanguage = (oppositeLangIconId) => {
    const pickedLangIconId = oppositeLangIconId === window.$primaryLanguageIconId ? window.$secondaryLanguageIconId : window.$primaryLanguageIconId;
    document.getElementById(oppositeLangIconId).removeAttribute("filter");
    document.getElementById(pickedLangIconId).setAttribute("filter", "brightness(40%)");
  }

  loadResumeFromPath = (path) => {
    $.ajax({
      url: path,
      dataType: "json",
      cache: false,
      success: (data) => this.setState({ resumeData: data }),
      error: (xhr, status, err) => alert(err),
    });
  }

  loadSharedData = () => {
    $.ajax({
      url: `portfolio_shared_data.json`,
      dataType: "json",
      cache: false,
      success: (data) => this.setState({ sharedData: data }, () => document.title = data.basic_info.name),
      error: (xhr, status, err) => alert(err),
    });
  }

  render() {
    const { resumeData, sharedData } = this.state;
    return (
      <Router>
        <Header sharedData={sharedData.basic_info} />
        <Routes>
          <Route path="/" element={<Home resumeData={resumeData} sharedData={sharedData} />} />
          <Route path="/about" element={<About resumeBasicInfo={resumeData.basic_info} sharedBasicInfo={sharedData.basic_info} />} />
        </Routes>
        <Footer sharedBasicInfo={sharedData.basic_info} applyPickedLanguage={this.applyPickedLanguage} />
      </Router>
    );
  }
}

export default App;
