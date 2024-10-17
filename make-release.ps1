# Make sure our master branch is up to date
git checkout master
git pull

# Remove our former release branch
git branch -D lastest-release 2>$null
git push origin --delete lastest-release 2>$null

# Create a new branch to run the build under
git checkout -b lastest-release

# Ensure we have the latest version of things
# rm -rf node_modules # package-lock.json <-- may want to remove this file too if it suits your project.
npm install 

# Test validity 
# npm test

# Build and update docs
npm run build # && git add -A docs

# Collect the version number
# releaseVersionNum=`node -e "let package = require('./package.json'); console.log(package.version)"`
# releaseVersion="v$releaseVersionNum" # of the form vX.X.X

# Collect the version number from package.json
$releaseVersionNum = node -e "let package = require('./package.json'); console.log(package.version)"
$releaseVersion = "v$releaseVersionNum"

# Allow the `dist` folder to be in the release
# newIgnore=`sed -e 's#dist##g' .gitignore`
# echo "$newIgnore" > .gitignore # the redirect here is put into a spereate step to avoid a locking issue with git

$newIgnore = Get-Content .gitignore | ForEach-Object { $_ -replace '/dist', '' }
$newIgnore | Set-Content .gitignore

git add -A && git commit -m "[BUILD] $releaseVersion"

# Make a new tag off of the latest build
git checkout master
git tag "$releaseVersion" lastest-release
git push origin "$releaseVersion"
git push origin lastest-release