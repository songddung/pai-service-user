pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Jenkins가 SCM 설정에 맞춰 코드 가져오기
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Hello from pai-service-user-ci 🎉"
            }
        }
    }
}
