// Set to false if you do not want the 'firefly' particles to display in the background
const doParticles = true;

// If set to true, the playercount banner will display the serverOfflineText (ie "Server isn't online!")
// If set to false, the playercount banner will hide the playercount (ie "Join other players on <IP>")
const tellUsersWhenServerIsOffline = true;

// If tellUsersWhenServerIsOffline is set to true, what text should be displayed?
const serverOfflineText = "Server isn't online!";

// When a user clicks on your server IP, what should it display briefly after the IP has been copied?
const ipCopiedText = "IP copied!";


// Particles initialisation
if (doParticles) {
    (async () => {
        await loadSlim(tsParticles);
        await tsParticles.load({
          id: "tsparticles",
          options: {
            fpsLimit: 100,
            particles: {
                number: {
                    value: 100,
                    density: { enable: true },
                },
                color: {
                    value: ["#ffffff", "#d4f4fc", "#dfebed"],
                },
                opacity: {
                    value: { min: 0.1, max: 0.5 },
                },
                size: {
                    value: { min: 0.7, max: 2 },
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    random: false,
                },
            }
          },
        });
      })();
}

// This is for the click to copy
const ipSpanElement = document.getElementById('ip');
const originalIPText = ipSpanElement.innerHTML;

ipSpanElement.addEventListener("click", () => {
    // Create a temporary textarea to copy the IP
    let tempTextarea = document.createElement("textarea");
    tempTextarea.style.position = "absolute";
    tempTextarea.style.left = "-99999px";
    tempTextarea.style.top = "0";
    document.body.appendChild(tempTextarea);
    tempTextarea.textContent = originalIPText;
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);

    // Temporarily display the IP copied text
    ipSpanElement.innerHTML = `<span class='extrapad'>${ipCopiedText}</span>`;
    setTimeout(() => {
        ipSpanElement.innerHTML = originalIPText;
    }, 800);
});

// This is to fetch the player count
const playercountBannerElement = document.getElementById('playercount');
const playercountSpanElement = document.getElementById('sip');

const initialisePlayercountFetcher = () => {
    const ip = playercountSpanElement.getAttribute("data-ip");
    const port = playercountSpanElement.getAttribute("data-port") || "25565";

    if (ip == "" || ip == null) return console.error("Error fetching player count - is the IP set correctly in the HTML?");
    
    updatePlayercount(ip, port);

    // Update player count every minute (not worth changing due to API cache)
    setInterval(() => updatePlayercount(ip, port), 60000);
};

const updatePlayercount = (ip, port) => {
    fetch(`https://api.bybilly.uk/api/players/${ip}/${port}`)
    .then(res => res.json())
    .then(data => {
        if (data.hasOwnProperty('online')) {
            // Update player count
            playercountSpanElement.innerHTML = data.online;
            playercountSpanElement.style.display = 'inline';
        } else {
            // Server is offline - change banner to server offline text or hide player count (see line 6)
            if (tellUsersWhenServerIsOffline) {
                playercountBannerElement.innerHTML = serverOfflineText;
            } else {
                playercountSpanElement.style.display = 'none';
            }
        }
    })
    .catch(err => {
        // Hide player count on error
        console.error(`Error fetching playercount: ${err}`);
        playercountSpanElement.style.display = 'none';
    });
};

initialisePlayercountFetcher();
