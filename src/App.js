import React, {Component} from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <center>
          <MainFrame/>
        </center>
      </div>
    );
  }
}

class MainFrame extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      topMovieName: '',
      topMoviePoster: '',
    }
  }

  render() {

    return (
      <div >
        <div style
            ={{
            'height': '300px',
            'border': '2px solid lightgrey',
            'borderRadius': '20px',
            'backgroundImage': 'url(http://gretchenrubin.com/wp-content/uploads/2016/04/moviesseats.jpg)',
          }}>
         
          <h1
            style
            ={{
            'font': '70px garamond',
            'color': 'white',
            'vertical-align': 'middle',
            'top': '50%'
          }}>
            <span>📽️ 🌞 ☠️ &nbsp;
            </span>
              REACT MOVIE TIME  
            <span>
              &nbsp; 🎎 ☃️ 💌
            </span>
          </h1>
        </div>
          <Browser />
      </div>
    );
  }

  passMoviesToMain(data){
    this.setState({
      testData: data
    });
  }
}

class Browser extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      lastSearch: '',
      apiKey: 'ba89fc9c98f5ea1bacb905d52416e52c',
      hasSearchResults: false,
      length: '',
      totalResults: [],
      topMovie: '',
      suggestedMovies: [],
      shouldWelcome: true,
      trailerVideoId: '',
      trailerImage: '',
      trailerTitle: ''

    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleClick = this
      .handleClick
      .bind(this);
    this.getResult = this
      .getResult
      .bind(this);
    this.displayResults = this
      .displayResults
      .bind(this);
      this.handleWelcome = this.handleWelcome.bind(this);
  }

  //stop
  getResult() {
    var jsonResult;
    const main = this;

    fetch('https://api.themoviedb.org/3/search/movie?api_key=' + this.state.apiKey + '&language=en-US&page=1&include_adult=false&query=' + this.state.value).then(function (response) {
      return response.json();
    })
      .then(function (data) {
        console.log(JSON.stringify(data.results));
        if (JSON.stringify(data.results)) {
          jsonResult = data.results[0];
          main.setState({
            totalResults: data.results,
            length: jsonResult.length,
            hasSearchResults: true,
            topMovie: data.results[0],
            suggestedMovies: [data.results[1], data.results[2], data.results[3], data.results[4], data.results[5], data.results[6], data.results[7], data.results[8]]
          });
        }
      })
      .catch(function (ex) {
        console.log('failed', ex)
      });
      
      ///////////////////////////
      // Get Trailer from youtube
      ///////////////////////////
      var jsonResult;
      //key=AIzaSyD0_4b7Onwr8HwtoVoW7bF5YPHJsBUxavU
      //key=AIzaSyA7Uhcrvk3CFzlbeHYPJpBvBpKGBGLAOxA
      fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyA7Uhcrvk3CFzlbeHYPJpBvBpKGBGLAOxA&q=trailer+' + this.state.topMovie.title).then(
        function (response) {
        return response.json();
      })
        .then(function (data) {
          if (JSON.stringify(data.items)) {
            jsonResult = data.items[0];
             main.setState({
              trailerVideoId: "https://www.youtube.com/embed/"+jsonResult.id.videoId,
              trailerImage: jsonResult.snippet.thumbnails.default.url,
              trailerTitle: jsonResult.snippet.title
            });            
          }
        })
        .catch(function (ex) {
          console.log('failed', ex);
        })      
      //////////////////////////
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // remove the line below if want the search to trigger onClick instead of onChange
    //this.handleClick();
  }

  handleClick() {
    this.getResult();
    this.setState({
      lastSearch: 'Returned ' + this.state.totalResults.length + ' search results for: ' + this.state.value,
      shouldWelcome: false
    });
  }

  displayResults() {
    this.setState({
      lastSearch: 'Returned ' + this.state.totalResults.length + ' search results for: ' + this.state.value
    });
  }

  handleWelcome(){
    if(this.state.shouldWelcome){
      return (
        <div>
        <h1 style={{'color': '#404856'}}> Hi! What movie are you in the mood for today? </h1>
        <img 
        src='https://uploads.disquscdn.com/images/a3a966252f7ed5368383ccd5cbb35f71ca3a613f3667775468d26a819298d635.gif'
        style={{
              'width': '350px',
              'height': '200px',
          }} />
        <img 
        src='https://i.giphy.com/media/BmTGK0Z986N7q/giphy.webp'
        style={{
              'width': '350px',
              'height': '200px',
          }} />
          <img 
          src='https://68.media.tumblr.com/a7e146a238ab4ffe4101f1dcbf7893b8/tumblr_mvw8v1JqzB1s4ip2qo1_500.gif'
          style={{
                'width': '350px',
                'height': '200px',
          }} />
        </div>
        );
      } else {

      return (
        <div>
          <TopMovie
            isTop={true}
            movie={this.state.topMovie}
            trailerVideoId={this.state.trailerVideoId}/>

          <br/>

          <SuggestedMoviesList
            movies={this.state.suggestedMovies}/>
        </div>
        );
      }
    
  }

  render() {
    const main = this;
    
    return (
      <div>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          style={{
          'width': '50%',
          'height': '25px',
          'border': '2px solid lightgrey',
          'borderRadius': '5px'
        }}/>


        <button
            onClick={this.handleClick}
            style={{
            'backgroundColor': '#008CBA',
            'color': 'white',
            'padding': '7px 24px',
            'border': '2px grey',
            'borderRadius': '5px'
          }}>
            search movies
        </button>
        <br/>
         {this.state.lastSearch}
        
        <br/>

        {this.handleWelcome()}

      </div>
    );
  }
}

class TopMovie extends Component {
  render() {
    console.log('testing top movie: ' + this.props.movie.poster_path);
    return (
      <div
        style={{
        'border': '2px solid grey',
        'borderRadius': '30px',
        'padding': '10px 5px'
      }}>

        <h1 style ={{
          'font': 'bold 20px helvetica'
        }}>
          <center>
            TOP SUGGESTION
          </center>
        </h1>

        <div style ={{}}>
          <MovieCard
            movie={this.props.movie}
            isTop={this.props.isTop}
            onClick={this.props.onClick}
            trailerVideoId={this.props.trailerVideoId}
            />
        </div>
      </div>

    );
  }
}

class SuggestedMoviesList extends Component {
  constructor() {
    super();
  }
  render() {
    var MovieList = this
      .props
      .movies
      .map(function (movie, index) {
        return (<MovieCard key={index} movie={movie}/>);
      });

    return (
      <div
        style={{
        'border': '2px solid grey',
        'borderRadius': '30px',
        'padding': '10px 5px'
      }}>
        <h1 style ={{
          'font': 'bold 20px helvetica'
        }}>
          OTHER MOVIES
        </h1>

        <div >
          {MovieList}
        </div>
      </div>
    );
  }
}

class MovieCard extends Component {
  constructor() {
    super();    
    this.onClick = this
      .onClick
      .bind(this);
  }
  onClick() {
    alert('test ' + this.props.name);
  }

  render() {
    var posterSize = ['200px', '280px'];
    if (this.props.isTop) {
      var titleCaption = <b>Title : </b>;
      var overviewCaption = <b><br/><br/>Overview : </b>;      
      var title = this.props.movie.title;
      var overview = this.props.movie.overview;

      var embededYoutube = <iframe width="500" height="300" src={this.props.trailerVideoId} frameborder="0" allowfullscreen></iframe>;

      posterSize = ['300px', '450px'];
      
      var topSideBar = <div
          style={{
          display: 'table-cell',
          width: '500px',
          'verticalAlign':'top',
          fontSize : '24px',
          textAlign: 'left',
          paddingLeft: '20px',
          paddingTop: '20px'
        }}>

          {titleCaption} {title} 
          {overviewCaption} {overview} 
          {embededYoutube}
        </div>

    }

    var poster = <img
      src={'https://image.tmdb.org/t/p/w500'+this.props.movie.poster_path}
      style={{
      width: posterSize[0],
      height: posterSize[1]
    }}/>;

    return (
      <div  style={{
          display: 'inline',
        }}
         onClick={this.onClick}>
      <div style={{
          display: 'inline',
        }}>
        <div
          style={{
          display: 'table-cell',
          paddingTop : '20px'
        }}>
          {poster}
        </div>
          {topSideBar}
        </div>
    
      </div>

    );
  }
}

export default App;