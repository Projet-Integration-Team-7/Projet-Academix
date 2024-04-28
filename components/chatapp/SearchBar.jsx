import React from 'react';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
  }

  handleSearch = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    this.props.onSearch(this.state.searchTerm.trim());
  };

  handleInputChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleSearch(event);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSearch} className="search-bar">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Search users..."
          aria-label="Search users"
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}

export default SearchBar;
