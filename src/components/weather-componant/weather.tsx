import { Component, h, State, Prop, Watch } from '@stencil/core';
import searchIcon from 'bootstrap-icons/icons/search.svg';
import droplet from 'bootstrap-icons/icons/droplet.svg';
import moisture from 'bootstrap-icons/icons/moisture.svg';
import wind from 'bootstrap-icons/icons/wind.svg';
import moon from 'bootstrap-icons/icons/moon.svg';
import sun from 'bootstrap-icons/icons/sun.svg';

@Component({
  tag: 'at-weather',
  styleUrl: 'weather.css',
  shadow: true,
})
export class Weather {
  cityInput: HTMLInputElement;

  @State() cityInputValue: string = '';
  @State() degrees: string = 'C';
  @Prop({ mutable: true, reflect: true }) city: string;

  @State() error = '';
  @State() loading: boolean = false;

  @State() daily: any = [];
  @State() Info: any;

  @State() validInput: boolean = false;
  apiKey = 'bbb976441f954711a8d153100231207';

  @Watch('city')
  cityChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      localStorage.setItem('lastSearch', newValue);
      this.cityInputValue = newValue;
      this.onSearch(newValue);
    }
  }

  componentWillLoad() {
    let temp = localStorage.getItem('lastSearch');
    if (temp !== null) {
      this.city = temp;
    } else {
      this.city = 'Lebanon';
    }
  }

  onUserInput(event: Event) {
    this.cityInputValue = (event.target as HTMLInputElement).value;
    if (this.cityInputValue.trim() !== '') {
      this.validInput = true;
    } else {
      this.validInput = false;
    }
  }

  fetchData(e: Event) {
    e.preventDefault();
    if (this.validInput) {
      this.city = this.cityInputValue;
    }
  }

  onSearch = (city: string) => {
    this.daily = [];
    this.loading = true;
    fetch(`https://api.weatherapi.com/v1/forecast.json?q=${city}&key=${this.apiKey}&days=7`)
      .then(res => res.json())
      .then(result => {
        this.loading = false;
        this.Info = result;
        for (let i = 1; i < 7; i++) {
          this.daily.push(this.Info.forecast.forecastday[i]);
        }
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
        console.log(err.message);
      });
  };
  switchDegrees(type: string) {
    if (this.degrees !== type) {
      this.degrees = type;
      return;
    }
  }
  getDayName(dateString) {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return days[date.getDay()];
  }

  search = atob(searchIcon.split(',')[1]);
  droplet = atob(droplet.split(',')[1]);
  moisture = atob(moisture.split(',')[1]);
  wind = atob(wind.split(',')[1]);
  moon = atob(moon.split(',')[1]);
  sun = atob(sun.split(',')[1]);

  render() {
    let weather = null;
    if (this.Info !== undefined) {
      weather = (
        <div class="weather">
          <div class="top">
            <div class="info">
              <h1 class="temp">{this.Info.current.temp_c}°C</h1>
              <h2 class="city">{this.Info.location.name}</h2>
              <h3 class="date">{this.Info.location.localtime}</h3>
            </div>
            <div class="icon-container">
              <img src={'https:' + this.Info.current.condition.icon} class="hourly-icon" />
            </div>
          </div>

          <div class="hourly-container">
            {this.Info.forecast.forecastday[0].hour.map((e: any) => {
              const timeParts = e.time.split(' ');
              const hour = timeParts[1];
              return (
                <div class="hourly">
                  <div class="hour">{hour}</div>
                  <div class="hourly-icon">
                    <img src={'https:' + e.condition.icon} class="icon" />
                  </div>
                  <div class="temp">{this.degrees === 'C' ? Math.floor(e.temp_c) : Math.floor(e.temp_f)}°</div>
                  <div class="hourly-humidity">
                    <span innerHTML={this.droplet}></span>
                    {e.humidity}%
                  </div>
                </div>
              );
            })}
          </div>

          <div class="daily-container">
            {this.daily.map((e: any) => {
              let day = this.getDayName(e.date);
              return (
                <div class="daily">
                  <div class="day">{day}</div>
                  <div class="dayly-humidity">{e.day.avghumidity}%</div>
                  <img src={e.day.condition.icon} class="daily-icon" />
                  <div class="temp">
                    {this.degrees === 'C' ? Math.floor(e.day.maxtemp_c) + '°|' + Math.floor(e.day.mintemp_c) : Math.floor(e.day.maxtemp_f) + '°|' + Math.floor(e.day.mintemp_f)}°
                  </div>
                </div>
              );
            })}
          </div>

          <div class="details">
            <div class="col left">
              <div innerHTML={this.moisture} class="bottom-icons"></div>
              <div>
                <p>Humidity</p>
                <p class="humidity">{this.Info.current.humidity}%</p>
              </div>
            </div>
            <div class="col">
              <div innerHTML={this.wind} class="bottom-icons"></div>
              <div>
                <p>Wind Speed</p>
                <p class="wind">{this.Info.current.wind_kph} km/h</p>
              </div>
            </div>
          </div>

          <div class="details">
            <div class="col left">
              <div class="rise-set">
                <p class="rise">
                  <strong>moonrise</strong>
                  <br />
                  {this.Info.forecast.forecastday[0].astro.moonrise}
                </p>
                <p class="set">
                  <strong>moonset</strong>
                  <br />
                  {this.Info.forecast.forecastday[0].astro.moonset}
                </p>
              </div>
              <div innerHTML={this.moon} class="bottom-icons"></div>
            </div>
            <div class="col">
              <div class="rise-set">
                <p class="rise">
                  <strong>sunrise</strong>
                  <br />
                  {this.Info.forecast.forecastday[0].astro.sunrise}
                </p>
                <p class="set">
                  <strong>sunset</strong>
                  <br />
                  {this.Info.forecast.forecastday[0].astro.sunset}
                </p>
              </div>
              <div innerHTML={this.sun} class="bottom-icons"></div>
            </div>
          </div>
        </div>
      );
    }

    let content = null;
    if (this.error) {
      content = <div>{this.error}</div>;
    }
    if (this.loading) {
      content = <at-spinner />;
    }

    return (
      <div class="card">
        <form onSubmit={this.fetchData.bind(this)}>
          <div class="search">
            <input type="text" placeholder="Enter city or country " ref={el => (this.cityInput = el)} value={this.cityInputValue} onInput={this.onUserInput.bind(this)} />
            <button type="submit">
              <div innerHTML={this.search}></div>
            </button>
          </div>
        </form>
        {content}
        <div class="switch-degrees">
          <button onClick={this.switchDegrees.bind(this, 'C')}>°C</button>|<button onClick={this.switchDegrees.bind(this, 'F')}>°F</button>
        </div>
        {weather}
      </div>
    );
  }
}

// export class Info{

// }
