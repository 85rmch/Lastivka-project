import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function searchProductPhotosInRepo() {
  // Let's get tree recursively of 85rmch/lastivka-photo
  try {
    const { data: repo } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner: '85rmch',
      repo: 'lastivka-photo',
      branch: 'main'
    });
    const treeSha = repo.commit.commit.tree.sha;
    
    const { data: treeData } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1', {
      owner: '85rmch',
      repo: 'lastivka-photo',
      tree_sha: treeSha
    });

    console.log('Total files in 85rmch/lastivka-photo repo:', treeData.tree.length);

    // Build a map of filename (lowercase, without ext) -> relative path
    const fileMap = new Map();
    treeData.tree.forEach(item => {
      if (item.type === 'blob') {
        const parts = item.path.split('/');
        const filename = parts[parts.length - 1];
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').toLowerCase();
        
        if (!fileMap.has(nameWithoutExt)) {
          fileMap.set(nameWithoutExt, []);
        }
        fileMap.get(nameWithoutExt).push(item.path);
      }
    });

    // Test product codes: A21, A22, A23, A24, C134, K95, K96, T341, T72, T67, T70, T91, T92, etc.
    const testCodes = ['a21', 'a22', 'a23', 'a24', 'c134', 'k95', 'k96', 't341', 't72', 't67', 't70', 't91', 't92', 'а21', 'т270', '156_1'];

    console.log('\n--- MATCHING PRODUCT CODES TO GITHUB REPO FILES ---');
    for (const code of testCodes) {
      const matches = fileMap.get(code);
      console.log(`Code: '${code}' -> Matches:`, matches || 'NONE');
    }
  } catch (e) {
    console.error('Error fetching tree:', e.message);
  }
}

searchProductPhotosInRepo();
