<h1>Localized</h1>
<strong>Project Description:</strong><br>
Localized is a platform created to endorse the Jordanian economy by increasing local manufacturers’ visibility and access to markets. The goal of Localized is to shorten the gap between small-medium scale producers and retailers by providing a simple, safe and effective platform for local product discovery and sales. An analytics driven interface for retailers to track purchase history and product profitability in which there is a comprehensive dashboard for manufacturers to monitor product performance, receive feedback and advanced features like product validation and secure payment processing are the main use cases of Localized.

<h1>Installation</h1>
<ol> 
 <li><strong>Clone the repository</strong> <pre> 
    <code>git clone https://github.com/hamzehNsirat/Localized</code> </pre></li>
 <li><strong>Navigate into the project directory</strong> <pre> <code>cd Localized</code> </pre></li>  <li><strong>Install dependencies</strong> Ensure you have <a href="https://nodejs.org/">Node.js</a> installed, then run: <pre> <code>npm install</code> </pre></li>
 <li><strong>Start the development server</strong> <pre> <code>npm run dev</code> </pre></li> 
</ol>

<strong>-------------------------------------</strong>

# Managing a Remote Repository as a Collaborator (Pushing to Development Branch)

<div>
  As a collaborator on your friend's GitHub repository, you'll push changes to the <strong>development</strong> branch and create a pull request (PR) for the <strong>main</strong> branch. Below are the steps to follow:
</div>

<h2>1. Cloning the Repository</h2>

<div>
  <ul>
    <li><strong>Step 1:</strong> Obtain the repository URL from your friend’s GitHub.</li>
    <li><strong>Step 2:</strong> Open a terminal and run the following command:</li>
    <pre>
      <code>git clone https://github.com/hamzehNsirat/Localized</code>
    </pre>
  </ul>
  This will create a local copy of the repository on your machine.
</div>

<h2>2. Create a New Branch from Development</h2>

<div>
  It is recommended to create a new branch from the <strong>development</strong> branch to make changes. To do this:
  <ul>
    <li><strong>Step 1:</strong> Navigate into the project directory:</li>
    <pre>
      <code>cd repository-name</code>
    </pre>
    <li><strong>Step 2:</strong> Switch to the <strong>development</strong> branch:</li>
    <pre>
      <code>git checkout development</code>
    </pre>
    <li><strong>Step 3:</strong> Create and switch to a new branch:</li>
    <pre>
      <code>git checkout -b new-feature-branch</code>
    </pre>
  </ul>
  Now, you're working in the <code>new-feature-branch</code>.
</div>

<h2>3. Make Changes and Commit</h2>

<div>
  After making your changes, follow these steps to commit:
  <ul>
    <li><strong>Step 1:</strong> Add your changes:</li>
    <pre>
      <code>git add .</code>
    </pre>
    <li><strong>Step 2:</strong> Commit the changes with a descriptive message:</li>
    <strong>PLEASE AS I SAID BEFORE THE COMMIT MESSAGE IS SO IMPORTANT PLEASE PROVIDE WHAT YOU COMMITED</strong>
    <strong>I REPEATTTT AS ABOVEEEE</strong>
    <pre>
      <code>git commit -m "Describe your changes here"</code>
    </pre>
  </ul>
</div>

<h2>4. Push Changes to the Development Branch</h2>

<div>
  Push your feature branch to the <strong>development</strong> branch in the remote repository:
  <ul>
    <li><strong>Step 1:</strong> Push the branch:</li>
    <pre>
      <code>git push origin new-feature-branch</code>
    </pre>
  </ul>
</div>

<h2>5. Open a Pull Request for Main Branch</h2>

<div>
  Once your feature branch is pushed to GitHub, you need to create a pull request to merge your changes into the <strong>main</strong> branch:
  <ul>
    <li><strong>Step 1:</strong> Go to the repository on GitHub.</li>
    <li><strong>Step 2:</strong> Open a pull request from <strong>development</strong> to <strong>main</strong>. Click on the "Compare & pull request" button for your branch.</li>
    <li><strong>Step 3:</strong> Add a title and description for the pull request, and submit it.</li>
  </ul>
</div>

<h2>6. Sync Changes from the Main Branch</h2>

<div>
  It’s important to stay updated with changes made in the <strong>main</strong> branch. Follow these steps to sync your local repository:
  <ul>
    <li><strong>Step 1:</strong> Switch to the <strong>main</strong> branch:</li>
    <pre>
      <code>git checkout main</code>
    </pre>
    <li><strong>Step 2:</strong> Pull the latest changes from the remote:</li>
    <pre>
      <code>git pull origin main</code>
    </pre>
  </ul>
</div>

<h2>For the Reviewrs</h2>
<h2>7. Merge Main Branch into Your Feature Branch</h2>

<div>
  Before completing your pull request, merge the latest changes from the <strong>main</strong> branch into your feature branch:
  <ul>
    <li><strong>Step 1:</strong> Switch to your feature branch:</li>
    <pre>
      <code>git checkout new-feature-branch</code>
    </pre>
    <li><strong>Step 2:</strong> Merge the main branch into your branch:</li>
    <pre>
      <code>git merge main</code>
    </pre>
  </ul>
</div>

<h2>8. Handling Merge Conflicts</h2>

<div>
  If you encounter merge conflicts, resolve them manually:
  <ul>
    <li><strong>Step 1:</strong> Open the conflicting files and fix the conflicts.</li>
    <li><strong>Step 2:</strong> Once resolved, add the files to the staging area:</li>
    <pre>
      <code>git add .</code>
    </pre>
    <li><strong>Step 3:</strong> Commit the resolution:</li>
    <pre>
      <code>git commit -m "Resolved merge conflicts"</code>
    </pre>
  </ul>
</div>

---

<h2>Regular Collaboration Tips</h2>

<div>
  <ul>
    <li>Collaborators should push only to the <strong>development</strong> branch and open pull requests to merge into the <strong>main</strong> branch.</li>
    <li>Always sync your local repository with the main branch before starting new work.</li>
    <li>Use clear and descriptive commit messages and branch names for better collaboration.</li>
  </ul>
</div>
