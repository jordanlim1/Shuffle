import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { ProfileCardProps } from "@/Interfaces/interfaces";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [activeTab, setActiveTab] = useState("info");

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null);

  async function refreshToken() {
    try {
      const profile_id = await AsyncStorage.getItem("profileId");

      const response = await fetch(
        `http://192.168.1.3:3000/auth/refresh-token/${profile_id}`
      );

      const data = await response.json();
      console.log("token response", data);
      if (data) {
        await SecureStore.setItemAsync("access_token", data);
        return fetchPlaylists();
      }
    } catch (err) {
      console.log(err, "Error refreshing token.");
    }
  }

  async function fetchPlaylists() {
    try {
      const access_token = await SecureStore.getItemAsync("access_token");

      const response = await fetch(
        `https://api.spotify.com/v1/users/${profile.spotifyId}/playlists?limit=4`,
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );

      if (response.status === 401) {
        // Token has expired; attempt to refresh it
        await refreshToken();
      }

      const data = await response.json();

      const albumInfo = data.items.map((playlist) => ({
        playlistName: playlist.name,
        playlistRef: playlist.href,
        playlistImage: playlist.images[0].url,
      }));
      setPlaylists(albumInfo);
    } catch (error) {
      console.log("Error fetching playlists, token expired.", error);
    }
  }

  // Fetch tracks from the selected playlist
  const fetchPlaylistTracks = async (playlistRef: string) => {
    const access_token = await SecureStore.getItemAsync("access_token");
    const response = await fetch(`${playlistRef}/tracks`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    const data = await response.json();

    const tracks = data.items.map((item) => ({
      songName: item.track.name,
      artistName: item.track.artists.map((artist) => artist.name).join(", "),
      albumImage: item.track.album.images[2]?.url || "",
    }));
    setSelectedPlaylistTracks(tracks);
  };
  return (
    <View style={styles.cardContainer}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "info" && styles.activeTab]}
          onPress={() => {
            setActiveTab("info");
            setSelectedPlaylistTracks(null);
          }}
        >
          <Text
            style={activeTab === "info" ? styles.activeTabText : styles.tabText}
          >
            Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "artists" && styles.activeTab,
          ]}
          onPress={() => {
            setActiveTab("artists");
            setSelectedPlaylistTracks(null);
          }}
        >
          <Text
            style={
              activeTab === "artists" ? styles.activeTabText : styles.tabText
            }
          >
            Artists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "playlists" && styles.activeTab,
          ]}
          onPress={() => {
            setActiveTab("playlists");
            setSelectedPlaylistTracks(null);
            fetchPlaylists();
          }}
        >
          <Text
            style={
              activeTab === "playlists" ? styles.activeTabText : styles.tabText
            }
          >
            Playlists
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        <View style={styles.contentContainer}>
          {activeTab === "info" && (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Age: {profile?.age}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  Location: {profile?.location?.city}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Height: {profile?.height}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Gender: {profile?.gender}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Race: {profile?.race}</Text>
              </View>
            </View>
          )}
          {activeTab === "artists" && (
            <View style={styles.artistsContainer}>
              {profile?.artists.map((artist, idx) => (
                <View key={idx} style={styles.artistRow}>
                  <Image
                    source={{ uri: artist.icon }}
                    style={styles.artistIcon}
                  />
                  <Text style={styles.artistText}>{artist.name}</Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === "playlists" && (
            <View>
              {!selectedPlaylistTracks ? (
                <FlatList
                  data={playlists}
                  keyExtractor={(item) => item.playlistRef}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.playlistContainer}
                      onPress={() => fetchPlaylistTracks(item.playlistRef)}
                    >
                      <Image
                        source={{ uri: item.playlistImage }}
                        style={styles.playlistImage}
                      />
                      <Text style={styles.playlistName}>
                        {item.playlistName}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <FlatList
                  data={selectedPlaylistTracks}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.trackContainer}>
                      <Image
                        source={{ uri: item.albumImage }}
                        style={styles.trackImage}
                      />
                      <View>
                        <Text style={styles.trackName}>{item.songName}</Text>
                        <Text style={styles.trackArtist}>
                          {item.artistName}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    height: 300,
    borderColor: "red",
    borderWidth: 2,
  },
  infoContainer: {
    width: "100%",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    paddingTop: 10,
  },
  tabButton: {
    paddingVertical: 10,
    width: "33%",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff5a79",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff5a79",
  },
  contentContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 8, // Adds spacing above the line
    borderBottomWidth: 1, // Creates the line underneath
    borderBottomColor: "#ccc", // Sets the line color to gray
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  artistsContainer: {
    marginTop: 5,
  },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 15,
  },
  iconContainer: {
    marginRight: 15, // Adds spacing between the icon and the text
  },
  artistIcon: {
    width: 60, // Adjust to desired icon size
    height: 60,
    borderRadius: 30, // Makes the icon circular if desired
  },
  artistText: {
    fontSize: 24,
    marginLeft: 15,
    color: "#333",
  },
  playlistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  playlistName: {
    fontSize: 16,
    color: "#333",
  },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  trackName: {
    fontSize: 16,
    color: "#333",
  },
  trackArtist: {
    fontSize: 14,
    color: "#888",
  },
  //   tracks: {
  //     backgroundColor: "black",
  //   },
});
