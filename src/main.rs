use shuttle_runtime::tokio::time;
use shuttle_runtime::SecretStore;
use std::process::Command;

// start a service to run the shuttle_run.sh bash script
#[shuttle_runtime::main]
#[allow(unused_must_use)]
async fn shuttle_main(
    #[shuttle_runtime::Secrets] secrets: SecretStore,
) -> Result<MyService, shuttle_runtime::Error> {
    // run the project
    Command::new("bash")
        .arg("/app/shuttle_run.sh")
        .envs(secrets.clone().into_iter())
        .spawn()
        .expect("Failed to start project")
        .wait();

    Ok(MyService {})
}

struct MyService {}

#[shuttle_runtime::async_trait]
impl shuttle_runtime::Service for MyService {
    async fn bind(self, _addr: std::net::SocketAddr) -> Result<(), shuttle_runtime::Error> {
        time::sleep(time::Duration::from_secs(1)).await;
        Ok(())
    }
}