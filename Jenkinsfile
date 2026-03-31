pipeline {
  agent any

  environment {
    REGISTRY = 'docker.io'
    IMAGE_NAME = 'stocky-saas'
    DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
        sh 'cd server && npm install'
        sh 'cd client && npm install'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test Backend') {
      steps {
        sh 'npm run test:server'
      }
    }

    stage('Test Frontend') {
      steps {
        sh 'npm run test:client'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          sh '''
            docker build -f Dockerfile.backend -t ${REGISTRY}/${IMAGE_NAME}-backend:${BUILD_NUMBER} .
            docker build -f Dockerfile.frontend -t ${REGISTRY}/${IMAGE_NAME}-frontend:${BUILD_NUMBER} .
            docker tag ${REGISTRY}/${IMAGE_NAME}-backend:${BUILD_NUMBER} ${REGISTRY}/${IMAGE_NAME}-backend:latest
            docker tag ${REGISTRY}/${IMAGE_NAME}-frontend:${BUILD_NUMBER} ${REGISTRY}/${IMAGE_NAME}-frontend:latest
          '''
        }
      }
    }

    stage('Push to Registry') {
      when {
        branch 'main'
      }
      steps {
        script {
          sh '''
            echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin
            docker push ${REGISTRY}/${IMAGE_NAME}-backend:${BUILD_NUMBER}
            docker push ${REGISTRY}/${IMAGE_NAME}-backend:latest
            docker push ${REGISTRY}/${IMAGE_NAME}-frontend:${BUILD_NUMBER}
            docker push ${REGISTRY}/${IMAGE_NAME}-frontend:latest
            docker logout
          '''
        }
      }
    }

    stage('Deploy to Production') {
      when {
        branch 'main'
      }
      steps {
        script {
          sh '''
            docker-compose -f docker-compose.yml pull
            docker-compose -f docker-compose.yml up -d
          '''
        }
      }
    }
  }

  post {
    always {
      junit 'server/coverage/junit.xml'
      publishHTML([
        reportDir: 'server/coverage',
        reportFiles: 'index.html',
        reportName: 'Backend Coverage Report'
      ])
    }
    failure {
      echo 'Pipeline failed!'
    }
    success {
      echo 'Pipeline succeeded!'
    }
  }
}
