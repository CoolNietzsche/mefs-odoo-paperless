# Remote Management for Mobile Users (Termius / Termux)

If you are on your phone and want to manage your build via GitHub Codespaces without using the web UI, follow these steps.

## 1. Initial Setup (on your phone)
If you are using **Android (Termux)**, install the GitHub CLI:
```bash
pkg install gh
```
If you are using **iOS (Termius)**, you will need to SSH into a remote server (like a small VPS or your own PC) that has the `gh` CLI installed.

## 2. Authenticate
```bash
gh auth login
```
*Follow the prompts to sign in via your browser.*

## 3. Manage Codespaces
To see your current codespaces:
```bash
gh cs list
```

To create a new one for this project:
```bash
gh cs create -r your-username/paperlessodoo -m standardLinux32gb
```

## 4. SSH into Codespace from Termius
Once you have the codespace name, you can SSH into it:
```bash
gh cs ssh -c <codespace-name>
```

## 5. Build the APK
Once connected to the codespace terminal, simply run:
```bash
# First time setup
bash .devcontainer/setup.sh

# Start the build
bash scripts/build-apk.sh
```

## 6. Download the APK
The build will run on Expo's servers. When finished, `eas` will provide a URL. You can open that URL in your phone's browser to download the `.apk` directly.
