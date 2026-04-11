import { loginWithEmail, loginWithFacebook, loginWithGoogle } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Complete any pending auth sessions (needed for web browser redirect)
WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = "1923047308315903";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // Computed flag to disable inputs/buttons while any login flow is active
  const anyLoading = emailLoading || googleLoading || facebookLoading;

  GoogleSignin.configure({
    webClientId:
      "862469355668-j6if8pmt2cqv0neutso4460cg63vnak6.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setEmailLoading(true);
    try {
      const response = await loginWithEmail({ email, password });

      if (response.success) {
        Alert.alert("Success", response.message || "Login successful!");
        router.push("/registration-complete");
      } else {
        Alert.alert(
          "Error",
          response.message || "Login failed. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      console.log("STEP 1: Starting Google login");

      await GoogleSignin.hasPlayServices();

      console.log("STEP 2: Play services OK");

      const userInfo = await GoogleSignin.signIn();

      console.log("User Info:", userInfo);

      const googleUserId = userInfo.data?.user?.id;
      const googleEmail = userInfo.data?.user?.email || "";
      console.log("Google User ID:", googleUserId);
      console.log("Google Email:", googleEmail);

      if (!googleUserId) {
        Alert.alert("Error", "Google user ID not found");
        return;
      }

      const response = await loginWithGoogle({
        type: "google",
        socialId: googleUserId,
        email: googleEmail,
        password: "",
      });

      console.log("Google Login API Response:", response);

      if (response.success) {
        Alert.alert("Success", response.message || "Login successful!", [
          { text: "OK", onPress: () => router.push("/registration-complete") },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.message || "Google login failed. Please try again.",
        );
      }
    } catch (error: any) {
      console.log("Google login error:", error);
      if (error?.code === "SIGN_IN_CANCELLED" || error?.code === "12501") {
        console.log("User cancelled Google sign-in");
        return;
      }
      Alert.alert("Error", "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Facebook OAuth using expo-auth-session
  const discovery = {
    authorizationEndpoint: "https://www.facebook.com/v19.0/dialog/oauth",
    tokenEndpoint: "https://graph.facebook.com/v19.0/oauth/access_token",
  };

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "sowlabassignment",
  });

  const [fbRequest, fbResponse, fbPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      scopes: ["public_profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery,
  );

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { access_token } = fbResponse.params;
      handleFacebookToken(access_token);
    } else if (fbResponse?.type === "error") {
      console.log("Facebook auth error:", fbResponse.error);
      Alert.alert("Error", "Facebook authentication failed. Please try again.");
      setFacebookLoading(false);
    } else if (fbResponse?.type === "dismiss") {
      console.log("User dismissed Facebook login");
      setFacebookLoading(false);
    }
  }, [fbResponse]);

  const handleFacebookToken = async (accessToken: string) => {
    try {
      // Fetch user info from Facebook Graph API
      const fbUserResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`,
      );
      const fbUser = await fbUserResponse.json();

      console.log("Facebook User:", fbUser);

      // Handle Graph API errors
      if (fbUser.error) {
        console.log("Facebook Graph API error:", fbUser.error);
        Alert.alert("Error", fbUser.error.message || "Failed to fetch Facebook profile.");
        return;
      }

      const fbUserId = fbUser.id;
      const fbEmail = fbUser.email || "";

      if (!fbUserId) {
        Alert.alert("Error", "Facebook user ID not found");
        return;
      }

      const response = await loginWithFacebook({
        type: "facebook",
        socialId: fbUserId,
        email: fbEmail,
        password: "",
      });

      console.log("Facebook Login API Response:", response);

      if (response.success) {
        Alert.alert("Success", response.message || "Login successful!", [
          { text: "OK", onPress: () => router.push("/registration-complete") },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.message || "Facebook login failed. Please try again.",
        );
      }
    } catch (error: any) {
      console.log("Facebook login error:", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error";
      Alert.alert("Facebook Login Error", `Failed to login with Facebook: ${errorMessage}`);
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setFacebookLoading(true);
      await fbPromptAsync();
    } catch (error: any) {
      console.log("Facebook login prompt error:", error);
      Alert.alert("Error", "Failed to open Facebook login. Please try again.");
      setFacebookLoading(false);
    }
  };

  const handleSocialLogin = async (type: "google" | "apple" | "facebook") => {
    if (type === "google") {
      handleGoogleLogin();
    } else if (type === "facebook") {
      handleFacebookLogin();
    } else {
      Alert.alert("Info", "Apple login is not available yet.");
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.timeText}></Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!anyLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!anyLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, emailLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={anyLoading}
          >
            {emailLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordBtn}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, googleLoading && styles.buttonDisabled]}
              onPress={() => handleSocialLogin("google")}
              disabled={anyLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#DB4437" size="small" />
              ) : (
                <Ionicons name="logo-google" size={22} color="#DB4437" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("apple")}
              disabled={anyLoading}
            >
              <Ionicons name="logo-apple" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, facebookLoading && styles.buttonDisabled]}
              onPress={() => handleSocialLogin("facebook")}
              disabled={anyLoading}
            >
              {facebookLoading ? (
                <ActivityIndicator color="#4267B2" size="small" />
              ) : (
                <Ionicons name="logo-facebook" size={22} color="#4267B2" />
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  timeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    marginBottom: 36,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 14,
  },
  loginButton: {
    backgroundColor: "#E8604C",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#E8604C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  forgotPasswordBtn: {
    alignSelf: "center",
    marginTop: 18,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: "#E8604C",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    color: "#999",
    fontSize: 13,
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 32,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F7F8FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 30,
  },
  signupText: {
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    color: "#E8604C",
    fontSize: 14,
    fontWeight: "700",
  },
});
