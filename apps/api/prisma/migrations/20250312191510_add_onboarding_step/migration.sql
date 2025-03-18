-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('create_domain', 'verify_domain', 'create_sender', 'send_test_email', 'completed');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboarding_step" "OnboardingStep" NOT NULL DEFAULT 'create_domain';
