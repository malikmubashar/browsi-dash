"use client";

const currentVersion = 1;

window.onload = function () {
    const DBOpenRequest = window.indexedDB.open("browsi-dash");

    DBOpenRequest.onerror = (event) => {
        console.log("error: Error loading database.");

    };

    DBOpenRequest.onsuccess = async (event) => {
        console.log("success: Database loaded.");

    };


    DBOpenRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log("upgrade: Database initialized.");
        db.onerror = (event) => {
            console.log("upgrade:error: Error loading database.");
        };

        const schema = db.createObjectStore('shortcuts', { keyPath: '_id' });
        schema.createIndex("name", "name");
        schema.createIndex("url", "url");
        schema.createIndex("icon", "icon");
        schema.createIndex("groupPart", "groupPart");
        schema.createIndex("home", "home");
        schema.createIndex("createdAt", "createdAt");
        schema.createIndex("updatedAt", "updatedAt");

        schema.add({
            _id: 1808337616669,
            name: "Google",
            url: "https://www.google.com",
            icon: "https://www.google.com/favicon.ico",
            home: true,
            createdAt: new Date().getTime(),
        });

    };

};
