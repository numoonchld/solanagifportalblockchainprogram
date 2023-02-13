const anchor = require('@project-serum/anchor');
const { SystemProgram } = require('@solana/web3.js');

const main = async () => {
  console.log("🚀 Starting test...")

  /* PROGRAM SETUP ========================================================================== */
  // anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solanagifportalblockchainprogram;

  // create a 'base' account keypair for this test to supply to the program
  const baseAccount = anchor.web3.Keypair.generate()

  // const tx = await program.methods.initialize().rpc();

  // call the program' constructor 
  let tx = await program.rpc.initialize({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  })

  console.log("📝 Your transaction signature", tx);


  /* GET: READ PROGRAM DATA ========================================================================== */
  // read account data
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  /*
  // Call add_gif!
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });

  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  */

  /* POST: DATA TO PROGRAM ========================================================================== */
  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("https://media.giphy.com/media/qbtSJYQgUIVgs/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  /* GET: READ PROGRAM DATA ========================================================================== */
  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();