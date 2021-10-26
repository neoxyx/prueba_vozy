import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import axios from "axios";

export default class Discover extends Component {
  constructor() {
    super();
    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
    };
  }

  componentDidMount() {
    axios("https://accounts.spotify.com/api/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(
            "ba783f0bec56452781f465a88cb96e1e:779f012f969241c5a49ab0cddffe9fc9"
          ),
      },
      data: "grant_type=client_credentials",
      method: "POST",
    }).then((tokenResponse) => {
      this.setState({ token: tokenResponse.data.access_token });
      axios("https://api.spotify.com/v1/browse/categories?locale=sv_US", {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.data.access_token },
      }).then((genResponse) => {
        this.setState({ categories: genResponse.data.categories.items });
      });
      axios("https://api.spotify.com/v1/browse/new-releases", {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.data.access_token },
      }).then((albumsResponse) => {
        this.setState({ newReleases: albumsResponse.data.albums.items });
      });
      axios("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.data.access_token },
      }).then((playlistsResponse) => {
        this.setState({ playlists: playlistsResponse.data.items });
      });
    });
  }

  render() {
    const { token, newReleases, playlists, categories } = this.state;
    console.log(token);
    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
