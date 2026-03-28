# Use Java 21 (IMPORTANT)
FROM maven:3.9.9-eclipse-temurin-21

WORKDIR /app

# Copy backend code
COPY trendly-backend /app

# Build jar using Maven (already installed in this image)
RUN mvn clean package -DskipTests

# Run app
CMD ["sh", "-c", "java -jar target/*.jar"]