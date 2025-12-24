import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontendLayout from "./layouts/FrontendLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Guidelines from "./pages/Guidelines";
import Candidates from "./pages/Candidates";
import CandidateSingle from "./pages/Candidate";
import ElectionResult from "./pages/ElectionResult";
import CandidacyApplication from "./pages/CandidacyApplication";
import CandidacyThankYou from "./pages/CandidacyAcknowledgement";
import HowToVote from "./pages/HowToVote";
import VoterVerification from "./pages/VoterVerification";

import VoterLogin from "./pages/voter/VoterLogin";
import Welcome from "./pages/voter/Welcome";
import VoterBallot from "./pages/voter/VoterBallot";
import ThankYou from "./pages/voter/ThankYou";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";

import Settings from "./pages/admin/Settings";
import NotFound from "./pages/admin/NotFound";

import Candidate from "./pages/admin/Candidate";
import AddCandidate from "./pages/admin/Candidates/AddCandidate";
import EditCandidate from "./pages/admin/Candidates/EditCandidate";
import ViewCandidate from "./pages/admin/Candidates/ViewCandidate";
import Applicants from "./pages/admin/Applicants";
import Positions from "./pages/admin/Positions";
import AddPosition from "./pages/admin/Positions/AddPosition";
import EditPosition from "./pages/admin/Positions/EditPosition";
import Churches from "./pages/admin/Churches";
import AddChurch from "./pages/admin/Churches/AddChurch";
import EditChurch from "./pages/admin/Churches/EditChurch";
import Questions from "./pages/admin/Questions";
import AddQuestion from "./pages/admin/Questions/AddQuestion";
import EditQuestion from "./pages/admin/Questions/EditQuestion";
import ElectoralGroup from "./pages/admin/ElectoralGroup";
import AddElectoralGroup from "./pages/admin/ElectoralGroup/AddElectoralGroup";
import EditElectoralGroup from "./pages/admin/ElectoralGroup/EditElectoralGroup";

import Voters from "./pages/admin/Voters";
import AddVoter from "./pages/admin/Voters/AddVoter";
import EditVoter from "./pages/admin/Voters/EditVoter";
import ViewVoter from "./pages/admin/Voters/ViewVoter";
import ImportVoters from "./pages/admin/Import";
import ImportByChurch from "./pages/admin/ImportByChurch";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
    return (
        <>
            <div
                id="global-loader"
                className="fixed inset-0 bg-white/70 z-50 hidden justify-center items-center"
            >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
            <Router>
                <Routes>
                    {/* Public frontend */}
                    <Route path="/" element={<FrontendLayout />}>
                        <Route index element={<Home />} />
                        <Route
                            path="privacy-policy"
                            element={<PrivacyPolicy />}
                        />
                        <Route
                            path="terms-and-conditions"
                            element={<TermsConditions />}
                        />
                        <Route
                            path="apply-candidacy"
                            element={<CandidacyApplication />}
                        />
                        <Route
                            path="candidacy-acknowledgement"
                            element={<CandidacyThankYou />}
                        />
                        <Route path="guidelines" element={<Guidelines />} />
                        <Route path="login" element={<AdminLogin />} />
                        <Route path="voter" element={<VoterLogin />} />
                        <Route path="thank-you" element={<ThankYou />} />
                        <Route path="candidates" element={<Candidates />} />
                        <Route
                            path="candidate/:slug"
                            element={<CandidateSingle />}
                        />
                        <Route
                            path="election-result"
                            element={<ElectionResult />}
                        />
                        <Route path="how-to-vote" element={<HowToVote />} />
                        <Route
                            path="voter-verification"
                            element={<VoterVerification />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Protected admin */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="/admin" element={<Dashboard />} />
                        <Route
                            path="/admin/candidate"
                            element={<Candidate />}
                        />
                        <Route
                            path="/admin/candidate/add"
                            element={<AddCandidate />}
                        />
                        <Route
                            path="/admin/candidate/edit/:candidateId"
                            element={<EditCandidate />}
                        />
                        <Route
                            path="/admin/candidate/view/:candidateId"
                            element={<ViewCandidate />}
                        />
                        <Route
                            path="/admin/candidate/applicants"
                            element={<Applicants />}
                        />
                        <Route
                            path="/admin/candidate/position"
                            element={<Positions />}
                        />
                        <Route
                            path="/admin/candidate/position/add"
                            element={<AddPosition />}
                        />
                        <Route
                            path="/admin/candidate/position/edit/:positionId"
                            element={<EditPosition />}
                        />
                        <Route
                            path="/admin/candidate/churches"
                            element={<Churches />}
                        />
                        <Route
                            path="/admin/candidate/churches/add"
                            element={<AddChurch />}
                        />
                        <Route
                            path="/admin/candidate/churches/edit/:churchId"
                            element={<EditChurch />}
                        />
                        <Route
                            path="/admin/candidate/questions"
                            element={<Questions />}
                        />
                        <Route
                            path="/admin/candidate/questions/add"
                            element={<AddQuestion />}
                        />
                        <Route
                            path="/admin/candidate/questions/edit/:questionId"
                            element={<EditQuestion />}
                        />
                        <Route
                            path="/admin/candidate/electoral-group"
                            element={<ElectoralGroup />}
                        />
                        <Route
                            path="/admin/candidate/electoral-group/add"
                            element={<AddElectoralGroup />}
                        />
                        <Route
                            path="/admin/candidate/electoral-group/edit/:electoralGroupId"
                            element={<EditElectoralGroup />}
                        />
                        <Route path="/admin/voters" element={<Voters />} />
                        <Route
                            path="/admin/voters/add"
                            element={<AddVoter />}
                        />
                        <Route
                            path="/admin/voters/edit/:voterId"
                            element={<EditVoter />}
                        />
                        <Route
                            path="/admin/voters/view/:voterId"
                            element={<ViewVoter />}
                        />
                        <Route
                            path="/admin/voters/import"
                            element={<ImportVoters />}
                        />

                        <Route
                            path="/admin/voters/import-by-church"
                            element={<ImportByChurch />}
                        />

                        <Route path="/admin/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Voter Routes */}
                    <Route
                        path="/vote"
                        element={
                            <ProtectedRoute role="voter">
                                <FrontendLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Default Dashboard */}
                        <Route index element={<Welcome />} />

                        {/* Other voter pages */}
                        <Route path="ballot" element={<VoterBallot />} />

                        {/* 404 if voter path doesn’t match */}
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Global 404 fallback */}
                </Routes>
            </Router>
        </>
    );
}
