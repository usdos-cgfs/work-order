# Deployment Instructions

1. Merge development changes into master (if done on github, pull changes to local development environment before proceeding.)
2. Remove or comment out `/dist` line from .gitignore, this will allow us to include our build results into source control.
3. Run `npm run build` from terminal
   1. NOTE: build assets should now be in `/dist` folder.
   2. if any errors, ensure you have node installed and run `npm install` to install esbuild
4. DO NOT STAGE AND COMMIT CHANGES TO .GITIGNORE! We don't want to include our build results normally.
5. stage and commit contents of `/dist` folder. DO NOT STAGE AND COMMIT CHANGES TO .GITIGNORE!
6. Discard changes to .gitignore and push commits
7. Create a new release: https://github.com/usdos-cgfs/work-order/releases
   1. Be sure to increment the version number from last release
8. Purge Cache:
   1. https://www.jsdelivr.com/tools/purge
   2. Purge the following files:  
      https://cdn.jsdelivr.net/gh/usdos-cgfs/work-order@latest/dist/app_bundle.txt  
      https://cdn.jsdelivr.net/gh/usdos-cgfs/work-order@latest/dist/app_bundle.js  
      https://cdn.jsdelivr.net/gh/usdos-cgfs/work-order@latest/dist/app.css
