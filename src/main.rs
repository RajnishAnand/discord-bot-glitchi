use shuttle_runtime::tokio::time;
use shuttle_runtime::SecretStore;
// use std::process::Command; --------
use std::process::Command;

#[shuttle_runtime::main]
async fn shuttle_main(
    #[shuttle_runtime::Secrets] secrets: SecretStore
 ) -> Result<MyService, shuttle_runtime::Error> {

// --------------
// Create a new Command to run 'ls'
//    let output = Command::new("ls")
//        .output()  // Execute the command and capture the output
//        .expect("Failed to execute command");
//
//    // Convert the output from bytes to a string
//    let stdout = String::from_utf8_lossy(&output.stdout);
//    
//    // Print the output of the 'ls' command
//    println!("{}", stdout);
// --------------


   let script_path = "/app/shuttle_runner.sh";

   let output = Command::new("bash")
       .arg(script_path)
       .envs(secrets.clone().into_iter())
       .output()
       .expect("Failed to execute script");

   if output.status.success() {
       let stdout = String::from_utf8_lossy(&output.stdout);
       println!("Script output:\n{}", stdout);
   } else {
       let stderr = String::from_utf8_lossy(&output.stderr);
       eprintln!("Error executing script:\n{}", stderr);
   }
   Ok(MyService {})
}

struct MyService {}


#[shuttle_runtime::async_trait]
impl shuttle_runtime::Service for MyService {
    async fn bind(self, _addr: std::net::SocketAddr) -> Result<(), shuttle_runtime::Error> {
        // Start your service and bind to the socket address
        time::sleep(time::Duration::from_secs(1)).await;
        Ok(())
    }
}
