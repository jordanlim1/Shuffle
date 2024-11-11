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
import { ProfileCardProps, Profile } from "@/Interfaces/interfaces";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useFont } from "./useFont";
const ProfileCard = ({ profileId }: ProfileCardProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [playlists, setPlaylists] = useState([]);
  const [profile, setProfile] = useState<Profile>();
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null);

  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData() {
    try {
      const response = await fetch(
        `http://192.168.137.245:3000/query/profile/${profileId}`
      );

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.log("Error in fetching profile data");
      return;
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshToken() {
    try {
      const response = await fetch(
        `http://192.168.137.245:3000/auth/refresh-token/${profileId}`
      );

      const data = await response.json();
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

  useFont();
  return (
    <View style={styles.safeArea}>
      {profile && (
        <View>
          <View style={styles.profileNameContainer}>
            <Text style={styles.name}>{`${profile?.name.split(" ")[0]}`}</Text>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: profile?.images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View
            style={[
              styles.cardContainer,
              (activeTab === "artists" || activeTab === "playlists") &&
                styles.darkBackground,
            ]}
          >
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "info" && styles.activeTabInfo,
                ]}
                onPress={() => {
                  setActiveTab("info");
                  setSelectedPlaylistTracks(null);
                }}
              >
                <Text
                  style={
                    activeTab === "info"
                      ? styles.activeTabTextInfo
                      : styles.tabText
                  }
                >
                  About
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
                    activeTab === "artists"
                      ? styles.activeTabText
                      : styles.tabText
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
                    activeTab === "playlists"
                      ? styles.activeTabText
                      : styles.tabText
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
                      <MaterialCommunityIcons
                        name="cake-variant-outline"
                        size={26}
                        color="black"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.infoText}>{profile?.age}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <AntDesign
                        name="home"
                        size={26}
                        color="black"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.infoText}>
                        {profile?.location?.city}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="human-male-height"
                        size={26}
                        color="black"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.infoText}>{profile?.height}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="male-female-outline"
                        size={26}
                        color="black"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.infoText}>{profile?.gender}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Fontisto
                        name="world-o"
                        size={26}
                        color="black"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.infoText}>{profile?.race}</Text>
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
                        scrollEnabled={false}
                        keyExtractor={(item) => item.playlistRef}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.playlistContainer}
                            onPress={() =>
                              fetchPlaylistTracks(item.playlistRef)
                            }
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
                      <View>
                        <TouchableOpacity
                          onPress={() => setSelectedPlaylistTracks(null)}
                        >
                          <Ionicons
                            name="return-down-back-sharp"
                            size={36}
                            color="white"
                            style={{ marginBottom: 20 }}
                          />
                        </TouchableOpacity>
                        <FlatList
                          data={selectedPlaylistTracks}
                          scrollEnabled={false}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <View style={styles.trackContainer}>
                              <Image
                                source={{ uri: item.albumImage }}
                                style={styles.trackImage}
                              />
                              <View style={styles.songDetails}>
                                <Text style={styles.trackName}>
                                  {item.songName}
                                </Text>
                                <Text style={styles.trackArtist}>
                                  {item.artistName}
                                </Text>
                              </View>
                            </View>
                          )}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={styles.imagesContainer}>
            {profile?.images.slice(1).map((image, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f9f9f9",
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    height: 350,
    borderColor: "#ff5a79",
    borderWidth: 2,
    width: "95%",
    marginTop: 20,
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    borderBottomColor: "#1DB954",
  },

  activeTabInfo: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff5a79",
  },
  activeTabText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1DB954",
  },
  tabText: {
    fontSize: 20,
    color: "#888",
  },
  activeTabTextInfo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff5a79",
  },
  contentContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
  },

  infoRow: {
    flexDirection: "row",
    display: "flex",
    marginBottom: 10,
    paddingBottom: 8, // Adds spacing above the line
    borderBottomWidth: 1, // Creates the line underneath
    borderBottomColor: "#ccc", // Sets the line color to gray
    width: "100%",
    marginTop: 5,
    marginLeft: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    color: "#333",
  },
  infoIcon: {
    marginRight: 10,
  },
  artistsContainer: {
    marginTop: 10,
  },
  darkBackground: {
    backgroundColor: "#121212",
    borderColor: "#1DB954",
    borderWidth: 2,
  },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 5,
  },

  artistIcon: {
    width: 60, // Adjust to desired icon size
    height: 60,
    borderRadius: 30, // Makes the icon circular if desired
  },
  artistText: {
    fontSize: 24,
    marginLeft: 20,
    color: "#FFFFFF",
  },
  playlistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  playlistImage: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  playlistName: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  trackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 5,
  },
  trackImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  trackName: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  trackArtist: {
    fontSize: 14,
    color: "#D2D2D2",
  },
  songDetails: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
  },
  profileNameContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },

  name: {
    paddingLeft: 20,
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "NotoSansMono",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  imageWrapper: {
    width: "95%",
    aspectRatio: 1,
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
