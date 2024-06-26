const firebaseConfig = {
  apiKey: "AIzaSyA9lsXWjCKInhmQBYOD8Ln0iElBTOaX4tw",
  authDomain: "vasantham-mobiles.firebaseapp.com",
  databaseURL:
    "https://vasantham-mobiles-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vasantham-mobiles",
  storageBucket: "vasantham-mobiles.appspot.com",
  messagingSenderId: "695369590474",
  appId: "1:695369590474:web:a0f8c33a14fb9b2ebc7633",
  measurementId: "G-D1D1ELN8NK",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

var database = firebase.database();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const shop = urlParams.get("shop");

var data;

function getShop() {
  // Get a reference to the document
  var docRef = db.collection("shops").doc(shop);
  // Retrieve the document
  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        // Document data exists, you can access it using doc.data()
        data = doc.data();
        updatedData = doc.data();
        document.getElementById("shop-name").value = data.name;
        document.getElementById("shop-phone").value = data.phone;
      } else {
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}

function capitalize(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

var updatedData;

function updateItem() {
  var shopName = capitalize(
    document.getElementById("shop-name").value.trim().toLowerCase()
  );
  var shopPhone = parseInt(document.getElementById("shop-phone").value, 10);

  const docRef = db.collection("shops").doc(shopName);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // Document exists, handle notification here
        db.collection("shops")
          .doc(shopName)
          .update({
            phone: shopPhone,
          })
          .then(() => {
            database.ref("/shops").update({ [shopName]: shopPhone });
            console.log("Document(shop) Updated successfully!");
            document.getElementById("alert-msg").textContent =
              shopName + " - Shop Updated!";
          });
      } else {
        updatedData.name = shopName;
        updatedData.phone = shopPhone;
        console.log("Updated Data: ", updatedData);
        db.collection("shops")
          .doc(shopName)
          .set(updatedData)
          .then(() => {
            database
              .ref("/shops")
              .update({ [shopName]: shopPhone })
              .then(() => {
                db.collection("shops")
                  .doc(data.name)
                  .delete()
                  .then(function () {
                    database
                      .ref("shops/" + data.name)
                      .remove()
                      .then(() => {
                        console.log(
                          data.name + " Document successfully deleted!"
                        );
                      });
                  })
                  .catch(function (error) {
                    console.error("Error removing document docid: ", error);
                  });
              });
            console.log(
              "Document(Shop) successfully updated inclusive of docid itself!"
            );
            document.getElementById("alert-msg").textContent =
              data.name + " - Shop Updated!";
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            document.getElementById("alert-msg").textContent =
              "Error Occured, Try Again!";
          });
      }
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
      document.getElementById("alert-msg").textContent =
        "Error Occured, Try Again!";
    });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    if (displayName != null) {
      console.log("Name: " + displayName);
    } else {
      alert("Set your Name in the 'My Account' section");
      window.location.href = "my-account.html";
    }
    var emailVerified = user.emailVerified;
    if (emailVerified) {
      getShop();
      const preloader = document.querySelector("#preloader");
      preloader.remove();
    } else {
      alert("Verify your mail in the 'My account' section");
      window.location.href = "my-account.html";
    }
  } else {
    // User is signed out
    // ...
    window.location.href = "login.html";
  }
});
