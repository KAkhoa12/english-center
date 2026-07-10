--
-- PostgreSQL database dump
--

-- Dumped from database version 17.10 (Debian 17.10-1.pgdg13+1)
-- Dumped by pg_dump version 17.0

-- Started on 2026-07-10 12:03:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1151 (class 1247 OID 17946)
-- Name: agent_message_role; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.agent_message_role AS ENUM (
    'human',
    'ai'
);


ALTER TYPE public.agent_message_role OWNER TO english_center_app;

--
-- TOC entry 1067 (class 1247 OID 17383)
-- Name: assignment_attachment_type; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.assignment_attachment_type AS ENUM (
    'file',
    'link'
);


ALTER TYPE public.assignment_attachment_type OWNER TO english_center_app;

--
-- TOC entry 1082 (class 1247 OID 17477)
-- Name: assignment_grading_method; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.assignment_grading_method AS ENUM (
    'teacher',
    'ai',
    'mixed'
);


ALTER TYPE public.assignment_grading_method OWNER TO english_center_app;

--
-- TOC entry 1109 (class 1247 OID 17684)
-- Name: assignment_question_type; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.assignment_question_type AS ENUM (
    'single_choice',
    'multiple_choice',
    'text_answer',
    'file_upload'
);


ALTER TYPE public.assignment_question_type OWNER TO english_center_app;

--
-- TOC entry 1061 (class 1247 OID 17334)
-- Name: assignment_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.assignment_status AS ENUM (
    'draft',
    'published',
    'closed',
    'archived'
);


ALTER TYPE public.assignment_status OWNER TO english_center_app;

--
-- TOC entry 1073 (class 1247 OID 17410)
-- Name: assignment_submission_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.assignment_submission_status AS ENUM (
    'draft',
    'submitted',
    'late',
    'graded',
    'returned',
    'cancelled'
);


ALTER TYPE public.assignment_submission_status OWNER TO english_center_app;

--
-- TOC entry 1103 (class 1247 OID 17654)
-- Name: assignment_type_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.assignment_type_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.assignment_type_status OWNER TO english_center_app;

--
-- TOC entry 1055 (class 1247 OID 17266)
-- Name: attendance_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused',
    'not_marked'
);


ALTER TYPE public.attendance_status OWNER TO english_center_app;

--
-- TOC entry 971 (class 1247 OID 16778)
-- Name: cart_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.cart_status AS ENUM (
    'active',
    'checked_out',
    'abandoned'
);


ALTER TYPE public.cart_status OWNER TO english_center_app;

--
-- TOC entry 1136 (class 1247 OID 17860)
-- Name: chat_message_type; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.chat_message_type AS ENUM (
    'text',
    'file',
    'image',
    'mixed'
);


ALTER TYPE public.chat_message_type OWNER TO english_center_app;

--
-- TOC entry 1040 (class 1247 OID 17176)
-- Name: class_enrollment_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.class_enrollment_status AS ENUM (
    'enrolled',
    'completed',
    'dropped',
    'cancelled'
);


ALTER TYPE public.class_enrollment_status OWNER TO english_center_app;

--
-- TOC entry 1145 (class 1247 OID 17908)
-- Name: class_schedule_name; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.class_schedule_name AS ENUM (
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'CN'
);


ALTER TYPE public.class_schedule_name OWNER TO english_center_app;

--
-- TOC entry 1034 (class 1247 OID 17138)
-- Name: class_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.class_status AS ENUM (
    'planned',
    'ongoing',
    'completed',
    'cancelled',
    'archived'
);


ALTER TYPE public.class_status OWNER TO english_center_app;

--
-- TOC entry 1031 (class 1247 OID 17130)
-- Name: class_type; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.class_type AS ENUM (
    'online',
    'offline',
    'hybrid'
);


ALTER TYPE public.class_type OWNER TO english_center_app;

--
-- TOC entry 1127 (class 1247 OID 17820)
-- Name: conversation_type; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.conversation_type AS ENUM (
    'direct'
);


ALTER TYPE public.conversation_type OWNER TO english_center_app;

--
-- TOC entry 932 (class 1247 OID 16537)
-- Name: course_category_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.course_category_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.course_category_status OWNER TO english_center_app;

--
-- TOC entry 1091 (class 1247 OID 17534)
-- Name: course_mode; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.course_mode AS ENUM (
    'template',
    'center'
);


ALTER TYPE public.course_mode OWNER TO english_center_app;

--
-- TOC entry 956 (class 1247 OID 16680)
-- Name: course_module_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.course_module_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.course_module_status OWNER TO english_center_app;

--
-- TOC entry 941 (class 1247 OID 16584)
-- Name: course_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.course_status AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public.course_status OWNER TO english_center_app;

--
-- TOC entry 1100 (class 1247 OID 17610)
-- Name: course_target_level; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.course_target_level AS ENUM (
    'A0',
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2'
);


ALTER TYPE public.course_target_level OWNER TO english_center_app;

--
-- TOC entry 1019 (class 1247 OID 17067)
-- Name: enrollment_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.enrollment_status AS ENUM (
    'active',
    'completed',
    'cancelled'
);


ALTER TYPE public.enrollment_status OWNER TO english_center_app;

--
-- TOC entry 995 (class 1247 OID 16927)
-- Name: invoice_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.invoice_status AS ENUM (
    'draft',
    'issued',
    'paid',
    'cancelled'
);


ALTER TYPE public.invoice_status OWNER TO english_center_app;

--
-- TOC entry 962 (class 1247 OID 16702)
-- Name: lesson_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.lesson_status AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public.lesson_status OWNER TO english_center_app;

--
-- TOC entry 986 (class 1247 OID 16860)
-- Name: order_payment_method; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.order_payment_method AS ENUM (
    'sepay_bank_transfer',
    'sepay_card',
    'sepay_napas_bank_transfer',
    'manual_cash',
    'manual_bank_transfer'
);


ALTER TYPE public.order_payment_method OWNER TO english_center_app;

--
-- TOC entry 983 (class 1247 OID 16845)
-- Name: order_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'awaiting_payment',
    'paid',
    'failed',
    'cancelled',
    'expired',
    'refunded'
);


ALTER TYPE public.order_status OWNER TO english_center_app;

--
-- TOC entry 1007 (class 1247 OID 16990)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.payment_method AS ENUM (
    'BANK_TRANSFER',
    'CARD',
    'NAPAS_BANK_TRANSFER',
    'MANUAL_CASH',
    'MANUAL_BANK_TRANSFER'
);


ALTER TYPE public.payment_method OWNER TO english_center_app;

--
-- TOC entry 1004 (class 1247 OID 16984)
-- Name: payment_provider; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.payment_provider AS ENUM (
    'sepay',
    'manual'
);


ALTER TYPE public.payment_provider OWNER TO english_center_app;

--
-- TOC entry 1010 (class 1247 OID 17002)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'processing',
    'approved',
    'failed',
    'cancelled',
    'refunded'
);


ALTER TYPE public.payment_status OWNER TO english_center_app;

--
-- TOC entry 1025 (class 1247 OID 17111)
-- Name: room_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.room_status AS ENUM (
    'active',
    'maintenance',
    'inactive'
);


ALTER TYPE public.room_status OWNER TO english_center_app;

--
-- TOC entry 1046 (class 1247 OID 17216)
-- Name: session_mode; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.session_mode AS ENUM (
    'online',
    'offline'
);


ALTER TYPE public.session_mode OWNER TO english_center_app;

--
-- TOC entry 1049 (class 1247 OID 17222)
-- Name: session_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.session_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


ALTER TYPE public.session_status OWNER TO english_center_app;

--
-- TOC entry 920 (class 1247 OID 16476)
-- Name: student_level; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.student_level AS ENUM (
    'beginner',
    'elementary',
    'intermediate',
    'upper_intermediate',
    'advanced'
);


ALTER TYPE public.student_level OWNER TO english_center_app;

--
-- TOC entry 902 (class 1247 OID 16399)
-- Name: user_status; Type: TYPE; Schema: public; Owner: english_center_app
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive',
    'banned'
);


ALTER TYPE public.user_status OWNER TO english_center_app;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 255 (class 1259 OID 17519)
-- Name: agent_states; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.agent_states (
    id uuid NOT NULL,
    session_id character varying(255) NOT NULL,
    messages jsonb DEFAULT '[]'::jsonb NOT NULL,
    metadata_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.agent_states OWNER TO english_center_app;

--
-- TOC entry 217 (class 1259 OID 16393)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO english_center_app;

--
-- TOC entry 251 (class 1259 OID 17387)
-- Name: assignment_attachments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignment_attachments (
    id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    title character varying(255),
    description text,
    file_bucket character varying(100),
    file_object_name character varying(500),
    external_url character varying(1000),
    content_type character varying(255),
    file_size integer,
    attachment_type public.assignment_attachment_type DEFAULT 'file'::public.assignment_attachment_type NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_attachments OWNER TO english_center_app;

--
-- TOC entry 254 (class 1259 OID 17483)
-- Name: assignment_grades; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignment_grades (
    id uuid NOT NULL,
    submission_id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    score numeric(5,2),
    max_score numeric(5,2) DEFAULT '10'::numeric NOT NULL,
    feedback text,
    rubric jsonb,
    graded_by uuid,
    graded_at timestamp with time zone,
    grading_method public.assignment_grading_method DEFAULT 'teacher'::public.assignment_grading_method NOT NULL,
    ai_grading_result_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_grades OWNER TO english_center_app;

--
-- TOC entry 260 (class 1259 OID 17712)
-- Name: assignment_question_options; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignment_question_options (
    id uuid NOT NULL,
    question_id uuid NOT NULL,
    option_text text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_question_options OWNER TO english_center_app;

--
-- TOC entry 259 (class 1259 OID 17693)
-- Name: assignment_questions; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignment_questions (
    id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    question_type public.assignment_question_type NOT NULL,
    question_text text NOT NULL,
    score numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_required boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_questions OWNER TO english_center_app;

--
-- TOC entry 252 (class 1259 OID 17423)
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignment_submissions (
    id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text,
    status public.assignment_submission_status DEFAULT 'draft'::public.assignment_submission_status NOT NULL,
    submitted_at timestamp with time zone,
    is_late boolean DEFAULT false NOT NULL,
    attempt_number integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_submissions OWNER TO english_center_app;

--
-- TOC entry 258 (class 1259 OID 17659)
-- Name: assignment_types; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignment_types (
    id uuid NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_auto_gradable boolean DEFAULT false NOT NULL,
    requires_file_submission boolean DEFAULT false NOT NULL,
    allow_text_submission boolean DEFAULT true NOT NULL,
    allow_file_submission boolean DEFAULT false NOT NULL,
    status public.assignment_type_status DEFAULT 'active'::public.assignment_type_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_types OWNER TO english_center_app;

--
-- TOC entry 250 (class 1259 OID 17343)
-- Name: assignments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.assignments (
    id uuid NOT NULL,
    class_id uuid,
    session_id uuid,
    lesson_id uuid,
    title character varying(255) NOT NULL,
    description text,
    instruction text,
    status public.assignment_status DEFAULT 'draft'::public.assignment_status NOT NULL,
    max_score numeric(5,2) DEFAULT '10'::numeric NOT NULL,
    due_at timestamp with time zone,
    allow_late_submission boolean DEFAULT true NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    assignment_type_id uuid NOT NULL
);


ALTER TABLE public.assignments OWNER TO english_center_app;

--
-- TOC entry 249 (class 1259 OID 17277)
-- Name: attendances; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.attendances (
    id uuid NOT NULL,
    session_id uuid NOT NULL,
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status public.attendance_status DEFAULT 'not_marked'::public.attendance_status NOT NULL,
    check_in_time timestamp with time zone,
    note text,
    recorded_by uuid,
    recorded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.attendances OWNER TO english_center_app;

--
-- TOC entry 236 (class 1259 OID 16799)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.cart_items (
    id uuid NOT NULL,
    cart_id uuid NOT NULL,
    course_id uuid NOT NULL,
    course_name character varying(255) NOT NULL,
    course_code character varying(100),
    unit_price numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    class_id uuid
);


ALTER TABLE public.cart_items OWNER TO english_center_app;

--
-- TOC entry 235 (class 1259 OID 16785)
-- Name: carts; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.carts (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    status public.cart_status DEFAULT 'active'::public.cart_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.carts OWNER TO english_center_app;

--
-- TOC entry 267 (class 1259 OID 17892)
-- Name: chat_message_attachments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.chat_message_attachments (
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    bucket character varying(100) NOT NULL,
    object_name character varying(500) NOT NULL,
    original_filename character varying(255),
    content_type character varying(255),
    size integer,
    url character varying(1000),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chat_message_attachments OWNER TO english_center_app;

--
-- TOC entry 266 (class 1259 OID 17869)
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.chat_messages (
    id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text,
    message_type public.chat_message_type DEFAULT 'text'::public.chat_message_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chat_messages OWNER TO english_center_app;

--
-- TOC entry 269 (class 1259 OID 17951)
-- Name: chat_session_messages; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.chat_session_messages (
    id uuid NOT NULL,
    agent_state_id uuid NOT NULL,
    role public.agent_message_role NOT NULL,
    content text NOT NULL,
    client_message_id character varying(255),
    metadata_json jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chat_session_messages OWNER TO english_center_app;

--
-- TOC entry 268 (class 1259 OID 17923)
-- Name: class_schedules; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.class_schedules (
    class_id uuid NOT NULL,
    schedule_name public.class_schedule_name NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.class_schedules OWNER TO english_center_app;

--
-- TOC entry 248 (class 1259 OID 17229)
-- Name: class_sessions; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.class_sessions (
    id uuid NOT NULL,
    class_id uuid NOT NULL,
    teacher_id uuid,
    lesson_id uuid,
    room_id uuid,
    title character varying(255) NOT NULL,
    description text,
    session_date date NOT NULL,
    mode public.session_mode DEFAULT 'offline'::public.session_mode NOT NULL,
    meeting_url character varying(1000),
    status public.session_status DEFAULT 'scheduled'::public.session_status NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    class_schedule_id uuid NOT NULL,
    override_start_time time without time zone,
    override_end_time time without time zone
);


ALTER TABLE public.class_sessions OWNER TO english_center_app;

--
-- TOC entry 263 (class 1259 OID 17791)
-- Name: class_sessions_media; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.class_sessions_media (
    id uuid NOT NULL,
    class_session_id uuid NOT NULL,
    media_id uuid NOT NULL,
    title character varying(255),
    description text,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.class_sessions_media OWNER TO english_center_app;

--
-- TOC entry 247 (class 1259 OID 17185)
-- Name: class_students; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.class_students (
    id uuid NOT NULL,
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    enrollment_id uuid,
    enrollment_status public.class_enrollment_status DEFAULT 'enrolled'::public.class_enrollment_status NOT NULL,
    enrolled_at timestamp with time zone NOT NULL,
    final_score numeric(5,2),
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.class_students OWNER TO english_center_app;

--
-- TOC entry 246 (class 1259 OID 17149)
-- Name: classes; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.classes (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    teacher_id uuid,
    name character varying(255) NOT NULL,
    code character varying(100),
    class_type public.class_type DEFAULT 'offline'::public.class_type NOT NULL,
    max_students integer NOT NULL,
    start_date date,
    status public.class_status DEFAULT 'planned'::public.class_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    room_id uuid
);


ALTER TABLE public.classes OWNER TO english_center_app;

--
-- TOC entry 265 (class 1259 OID 17838)
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.conversation_participants (
    id uuid NOT NULL,
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.conversation_participants OWNER TO english_center_app;

--
-- TOC entry 264 (class 1259 OID 17823)
-- Name: conversations; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.conversations (
    id uuid NOT NULL,
    type public.conversation_type DEFAULT 'direct'::public.conversation_type NOT NULL,
    title character varying(255),
    class_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.conversations OWNER TO english_center_app;

--
-- TOC entry 226 (class 1259 OID 16541)
-- Name: course_categories; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_categories (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    description text,
    status public.course_category_status DEFAULT 'active'::public.course_category_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_categories OWNER TO english_center_app;

--
-- TOC entry 244 (class 1259 OID 17073)
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_enrollments (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    student_id uuid,
    course_id uuid NOT NULL,
    order_id uuid,
    order_item_id uuid,
    enrollment_status public.enrollment_status DEFAULT 'active'::public.enrollment_status NOT NULL,
    enrolled_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_enrollments OWNER TO english_center_app;

--
-- TOC entry 257 (class 1259 OID 17556)
-- Name: course_media; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_media (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    media_id uuid NOT NULL,
    media_type character varying(50),
    order_index integer DEFAULT 0 NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_media OWNER TO english_center_app;

--
-- TOC entry 232 (class 1259 OID 16685)
-- Name: course_modules; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_modules (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    order_index integer DEFAULT 0 NOT NULL,
    status public.course_module_status DEFAULT 'active'::public.course_module_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    media_id uuid
);


ALTER TABLE public.course_modules OWNER TO english_center_app;

--
-- TOC entry 231 (class 1259 OID 16664)
-- Name: course_outcomes; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_outcomes (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    outcome_text text NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_outcomes OWNER TO english_center_app;

--
-- TOC entry 230 (class 1259 OID 16649)
-- Name: course_requirements; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_requirements (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    requirement_text text NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_requirements OWNER TO english_center_app;

--
-- TOC entry 229 (class 1259 OID 16630)
-- Name: course_tag_mappings; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_tag_mappings (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_tag_mappings OWNER TO english_center_app;

--
-- TOC entry 227 (class 1259 OID 16557)
-- Name: course_tags; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_tags (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_tags OWNER TO english_center_app;

--
-- TOC entry 237 (class 1259 OID 16823)
-- Name: course_wishlists; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.course_wishlists (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_wishlists OWNER TO english_center_app;

--
-- TOC entry 228 (class 1259 OID 16591)
-- Name: courses; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.courses (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(100) NOT NULL,
    slug character varying(255),
    description text,
    target_level public.course_target_level,
    output_goal text,
    total_sessions integer,
    price numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    status public.course_status DEFAULT 'active'::public.course_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    category_id uuid NOT NULL,
    mode public.course_mode DEFAULT 'center'::public.course_mode NOT NULL
);


ALTER TABLE public.courses OWNER TO english_center_app;

--
-- TOC entry 270 (class 1259 OID 17971)
-- Name: guest_enrollments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.guest_enrollments (
    id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.guest_enrollments OWNER TO english_center_app;

--
-- TOC entry 241 (class 1259 OID 16965)
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.invoice_items (
    id uuid NOT NULL,
    invoice_id uuid NOT NULL,
    course_id uuid,
    item_name character varying(255) NOT NULL,
    item_code character varying(100),
    unit_price numeric(12,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    class_id uuid
);


ALTER TABLE public.invoice_items OWNER TO english_center_app;

--
-- TOC entry 240 (class 1259 OID 16935)
-- Name: invoices; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.invoices (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    invoice_number character varying(50) NOT NULL,
    invoice_status public.invoice_status DEFAULT 'draft'::public.invoice_status NOT NULL,
    issued_at timestamp with time zone,
    paid_at timestamp with time zone,
    buyer_name character varying(255),
    buyer_email character varying(255),
    buyer_phone character varying(30),
    billing_address text,
    currency character varying(10) DEFAULT 'VND'::character varying NOT NULL,
    subtotal_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    discount_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    total_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    invoice_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invoices OWNER TO english_center_app;

--
-- TOC entry 234 (class 1259 OID 16755)
-- Name: lesson_materials; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.lesson_materials (
    id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    external_url character varying(1000),
    order_index integer DEFAULT 0 NOT NULL,
    is_downloadable boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    media_id uuid
);


ALTER TABLE public.lesson_materials OWNER TO english_center_app;

--
-- TOC entry 233 (class 1259 OID 16709)
-- Name: lessons; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.lessons (
    id uuid NOT NULL,
    course_id uuid NOT NULL,
    module_id uuid,
    title character varying(255) NOT NULL,
    description text,
    content jsonb,
    order_index integer DEFAULT 0 NOT NULL,
    estimated_duration_minutes integer,
    status public.lesson_status DEFAULT 'draft'::public.lesson_status NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    media_id uuid
);


ALTER TABLE public.lessons OWNER TO english_center_app;

--
-- TOC entry 256 (class 1259 OID 17539)
-- Name: media; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.media (
    id uuid NOT NULL,
    bucket character varying(100) NOT NULL,
    object_name character varying(500) NOT NULL,
    original_filename character varying(255),
    content_type character varying(255),
    size integer,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    folder character varying(255)
);


ALTER TABLE public.media OWNER TO english_center_app;

--
-- TOC entry 239 (class 1259 OID 16908)
-- Name: order_items; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    course_id uuid NOT NULL,
    course_name character varying(255) NOT NULL,
    course_code character varying(100),
    unit_price numeric(12,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    class_id uuid
);


ALTER TABLE public.order_items OWNER TO english_center_app;

--
-- TOC entry 238 (class 1259 OID 16871)
-- Name: orders; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    student_id uuid,
    cart_id uuid,
    order_code character varying(50) NOT NULL,
    invoice_number character varying(50) NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    currency character varying(10) DEFAULT 'VND'::character varying NOT NULL,
    subtotal_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    discount_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    total_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    note text,
    payment_method public.order_payment_method,
    paid_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    expired_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.orders OWNER TO english_center_app;

--
-- TOC entry 242 (class 1259 OID 17015)
-- Name: payments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    invoice_id uuid,
    user_id uuid NOT NULL,
    provider public.payment_provider NOT NULL,
    payment_method public.payment_method NOT NULL,
    status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'VND'::character varying NOT NULL,
    provider_payment_id character varying(255),
    provider_transaction_id character varying(255),
    checkout_url text,
    raw_request jsonb,
    raw_response jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.payments OWNER TO english_center_app;

--
-- TOC entry 220 (class 1259 OID 16430)
-- Name: permissions; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    code character varying(150) NOT NULL,
    name character varying(255),
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO english_center_app;

--
-- TOC entry 222 (class 1259 OID 16458)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.role_permissions OWNER TO english_center_app;

--
-- TOC entry 219 (class 1259 OID 16419)
-- Name: roles; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO english_center_app;

--
-- TOC entry 245 (class 1259 OID 17117)
-- Name: rooms; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.rooms (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    capacity integer NOT NULL,
    location character varying(255),
    status public.room_status DEFAULT 'active'::public.room_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.rooms OWNER TO english_center_app;

--
-- TOC entry 243 (class 1259 OID 17044)
-- Name: sepay_ipn_logs; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.sepay_ipn_logs (
    id uuid NOT NULL,
    order_id uuid,
    payment_id uuid,
    invoice_number character varying(50),
    notification_type character varying(100),
    sepay_order_id character varying(255),
    sepay_transaction_id character varying(255),
    transaction_status character varying(100),
    payload jsonb NOT NULL,
    headers jsonb,
    is_valid boolean DEFAULT false NOT NULL,
    processed_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sepay_ipn_logs OWNER TO english_center_app;

--
-- TOC entry 225 (class 1259 OID 16520)
-- Name: staff_profiles; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.staff_profiles (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    "position" character varying(255),
    department character varying(255),
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.staff_profiles OWNER TO english_center_app;

--
-- TOC entry 223 (class 1259 OID 16487)
-- Name: students; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.students (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    date_of_birth date,
    gender character varying(20),
    address text,
    level public.student_level,
    learning_goal text,
    parent_name character varying(255),
    parent_phone character varying(30),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.students OWNER TO english_center_app;

--
-- TOC entry 262 (class 1259 OID 17752)
-- Name: submission_answer_media; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.submission_answer_media (
    id uuid NOT NULL,
    submission_answer_id uuid NOT NULL,
    media_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.submission_answer_media OWNER TO english_center_app;

--
-- TOC entry 261 (class 1259 OID 17729)
-- Name: submission_answers; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.submission_answers (
    id uuid NOT NULL,
    submission_id uuid NOT NULL,
    question_id uuid NOT NULL,
    answer_text text,
    selected_option_ids jsonb,
    is_correct boolean,
    score numeric(5,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.submission_answers OWNER TO english_center_app;

--
-- TOC entry 253 (class 1259 OID 17456)
-- Name: submission_attachments; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.submission_attachments (
    id uuid NOT NULL,
    submission_id uuid NOT NULL,
    title character varying(255),
    file_bucket character varying(100) NOT NULL,
    file_object_name character varying(500) NOT NULL,
    original_filename character varying(255),
    content_type character varying(255),
    file_size integer,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.submission_attachments OWNER TO english_center_app;

--
-- TOC entry 224 (class 1259 OID 16503)
-- Name: teachers; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.teachers (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    specialization character varying(255),
    bio text,
    experience_years integer DEFAULT 0 NOT NULL,
    certificates jsonb,
    hourly_rate numeric(12,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.teachers OWNER TO english_center_app;

--
-- TOC entry 221 (class 1259 OID 16441)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_roles OWNER TO english_center_app;

--
-- TOC entry 218 (class 1259 OID 16405)
-- Name: users; Type: TABLE; Schema: public; Owner: english_center_app
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30),
    password_hash character varying(255) NOT NULL,
    avatar_url character varying(500),
    status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO english_center_app;

--
-- TOC entry 4323 (class 0 OID 17519)
-- Dependencies: 255
-- Data for Name: agent_states; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.agent_states (id, session_id, messages, metadata_state, created_at, updated_at, deleted_at) FROM stdin;
77cf2098-8251-4405-a595-cf6919f56c20	642f451a-17de-4441-9c35-e96fc1eabe86	[{"type": "human", "content": "chào em"}, {"type": "ai", "content": "Chào anh/chị! Em có thể hỗ trợ gì cho anh/chị hôm nay ạ? Anh/chị muốn tìm hiểu về khóa học tiếng Anh nào không?"}]	{"flow": {"actions": [{"task": "general", "reason": "Người dùng chỉ chào hỏi, không cần gọi dữ liệu.", "filters": null, "priority": 10, "user_info": null, "action_context": "normal_question"}], "needs_clarification": false, "clarification_question": null}, "thread_id": "642f451a-17de-4441-9c35-e96fc1eabe86", "task_result": [{"task": "general", "reason": "Người dùng chỉ chào hỏi, không cần gọi dữ liệu.", "status": "ok"}], "final_answer": "Chào anh/chị! Em có thể hỗ trợ gì cho anh/chị hôm nay ạ? Anh/chị muốn tìm hiểu về khóa học tiếng Anh nào không?", "tool_results": [{"task": "general", "reason": "Người dùng chỉ chào hỏi, không cần gọi dữ liệu.", "status": "ok"}], "action_context": "normal_question", "planner_decision": {"actions": [], "needs_clarification": false, "clarification_question": null}, "client_message_id": "1783531863955-user"}	2026-07-08 17:31:02.402924+00	2026-07-08 17:31:02.402924+00	\N
\.


--
-- TOC entry 4285 (class 0 OID 16393)
-- Dependencies: 217
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.alembic_version (version_num) FROM stdin;
20260710_0019
\.


--
-- TOC entry 4319 (class 0 OID 17387)
-- Dependencies: 251
-- Data for Name: assignment_attachments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignment_attachments (id, assignment_id, title, description, file_bucket, file_object_name, external_url, content_type, file_size, attachment_type, order_index, uploaded_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4322 (class 0 OID 17483)
-- Dependencies: 254
-- Data for Name: assignment_grades; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignment_grades (id, submission_id, assignment_id, student_id, score, max_score, feedback, rubric, graded_by, graded_at, grading_method, ai_grading_result_id, created_at, updated_at, deleted_at) FROM stdin;
161519c0-8f01-4ccd-8298-10dc9c41f299	902c7ac2-65b6-4013-9378-7356138ed232	d206157a-3d5a-4601-a196-dd5f916f0692	0b449963-41de-45a8-9b03-d86c666a8fbf	8.00	10.00	Good structure. Review grammar accuracy.	\N	8eac94e2-8b88-47a2-a63d-388fa488db49	2026-07-08 17:58:07.555752+00	teacher	\N	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
\.


--
-- TOC entry 4328 (class 0 OID 17712)
-- Dependencies: 260
-- Data for Name: assignment_question_options; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignment_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4327 (class 0 OID 17693)
-- Dependencies: 259
-- Data for Name: assignment_questions; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignment_questions (id, assignment_id, question_type, question_text, score, order_index, is_required, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4320 (class 0 OID 17423)
-- Dependencies: 252
-- Data for Name: assignment_submissions; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignment_submissions (id, assignment_id, student_id, user_id, content, status, submitted_at, is_late, attempt_number, created_at, updated_at, deleted_at) FROM stdin;
902c7ac2-65b6-4013-9378-7356138ed232	d206157a-3d5a-4601-a196-dd5f916f0692	0b449963-41de-45a8-9b03-d86c666a8fbf	e270724d-7e71-44b5-aefb-59bba9ff1007	This is a sample writing submission.	graded	2026-07-08 17:58:07.53166+00	f	1	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
\.


--
-- TOC entry 4326 (class 0 OID 17659)
-- Dependencies: 258
-- Data for Name: assignment_types; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignment_types (id, code, name, description, is_auto_gradable, requires_file_submission, allow_text_submission, allow_file_submission, status, created_at, updated_at, deleted_at) FROM stdin;
a92d282a-baa6-4395-a8d0-9ed06e7b9cdc	homework	Homework	\N	f	f	t	f	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
5005c471-34f4-46b3-a3be-895e22d1ce61	quiz	Quiz	\N	t	f	f	f	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
429dd246-cfe3-4e85-a6a7-fad183752554	exam	Exam	\N	f	f	t	f	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
b31b2472-f58a-446b-a02d-1b48a6a76611	practice	Practice	\N	t	f	t	f	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
390fd4d9-97f7-4a65-a349-e0187b283815	project	Project	\N	f	t	t	t	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
3ed3fe9e-3e54-4e09-99b7-d58ab160a7e3	speaking	Speaking	\N	f	f	t	f	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
88812d2b-2c1d-400b-86f9-6a974f269ff3	writing	Writing	\N	f	f	t	f	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
6a8904eb-c7fa-4c8d-afe7-16880862d1c7	file_upload	File Upload	\N	f	t	f	t	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
4522785b-da5c-4aa0-bdaa-d8209dfc7a10	mixed	Mixed	\N	f	t	t	t	active	2026-07-08 08:21:51.730322+00	2026-07-08 08:21:51.730322+00	\N
\.


--
-- TOC entry 4318 (class 0 OID 17343)
-- Dependencies: 250
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.assignments (id, class_id, session_id, lesson_id, title, description, instruction, status, max_score, due_at, allow_late_submission, created_by, created_at, updated_at, deleted_at, assignment_type_id) FROM stdin;
d206157a-3d5a-4601-a196-dd5f916f0692	8c255c99-7ef4-4066-96a5-206961a8c97f	8a5490a6-3606-4fc7-aa5c-b21044cc194d	4d657569-270c-4ea3-ba5a-2251dff54061	Writing Task 1 Homework	Write a short line graph report	Write at least 150 words.	published	10.00	2026-07-15 16:40:36+00	t	8eac94e2-8b88-47a2-a63d-388fa488db49	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	88812d2b-2c1d-400b-86f9-6a974f269ff3
226e9375-66f5-4be7-8929-83e3d03e84e0	8c255c99-7ef4-4066-96a5-206961a8c97f	\N	\N	Vocabulary Practice	Practice key words from the latest lesson	\N	published	10.00	\N	t	8eac94e2-8b88-47a2-a63d-388fa488db49	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	b31b2472-f58a-446b-a02d-1b48a6a76611
\.


--
-- TOC entry 4317 (class 0 OID 17277)
-- Dependencies: 249
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.attendances (id, session_id, class_id, student_id, status, check_in_time, note, recorded_by, recorded_at, created_at, updated_at, deleted_at) FROM stdin;
0483cd7a-aa8d-466a-9e46-d7b66da64409	2519663d-035d-48b6-8920-fbf3b7344181	8c255c99-7ef4-4066-96a5-206961a8c97f	0b449963-41de-45a8-9b03-d86c666a8fbf	present	\N	\N	8eac94e2-8b88-47a2-a63d-388fa488db49	2026-07-08 17:58:07.411558+00	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
5189989e-8394-4a8d-a3ac-3f223ce00705	2519663d-035d-48b6-8920-fbf3b7344181	8c255c99-7ef4-4066-96a5-206961a8c97f	34379d94-2dd2-495f-adcf-6173bd2a5253	absent	\N	\N	8eac94e2-8b88-47a2-a63d-388fa488db49	2026-07-08 17:58:07.416051+00	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
744d57b4-e225-4338-b2e8-c26eaba96447	2519663d-035d-48b6-8920-fbf3b7344181	8c255c99-7ef4-4066-96a5-206961a8c97f	53015e43-135b-4c40-9a31-a23e8eeae7c4	late	\N	\N	8eac94e2-8b88-47a2-a63d-388fa488db49	2026-07-08 17:58:07.421416+00	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
\.


--
-- TOC entry 4304 (class 0 OID 16799)
-- Dependencies: 236
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.cart_items (id, cart_id, course_id, course_name, course_code, unit_price, quantity, total_price, created_at, updated_at, deleted_at, class_id) FROM stdin;
\.


--
-- TOC entry 4303 (class 0 OID 16785)
-- Dependencies: 235
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.carts (id, user_id, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4335 (class 0 OID 17892)
-- Dependencies: 267
-- Data for Name: chat_message_attachments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.chat_message_attachments (id, message_id, bucket, object_name, original_filename, content_type, size, url, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4334 (class 0 OID 17869)
-- Dependencies: 266
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.chat_messages (id, conversation_id, sender_id, content, message_type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4337 (class 0 OID 17951)
-- Dependencies: 269
-- Data for Name: chat_session_messages; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.chat_session_messages (id, agent_state_id, role, content, client_message_id, metadata_json, created_at, updated_at, deleted_at) FROM stdin;
2ef9746b-52f3-469e-94a4-4212a1b9bbb7	77cf2098-8251-4405-a595-cf6919f56c20	human	chào em	1783531863955-user	\N	2026-07-08 17:31:02.402924+00	2026-07-08 17:31:02.402924+00	\N
492e33d1-d3b1-4257-9c3d-776c1e45d728	77cf2098-8251-4405-a595-cf6919f56c20	ai	Chào anh/chị! Em có thể hỗ trợ gì cho anh/chị hôm nay ạ? Anh/chị muốn tìm hiểu về khóa học tiếng Anh nào không?	\N	{"flow": {"actions": [{"task": "general", "reason": "Người dùng chỉ chào hỏi, không cần gọi dữ liệu.", "filters": null, "priority": 10, "user_info": null, "action_context": "normal_question"}], "needs_clarification": false, "clarification_question": null}, "messages": [{"type": "human", "content": "chào em"}, {"type": "ai", "content": "Chào anh/chị! Em có thể hỗ trợ gì cho anh/chị hôm nay ạ? Anh/chị muốn tìm hiểu về khóa học tiếng Anh nào không?"}], "thread_id": "642f451a-17de-4441-9c35-e96fc1eabe86", "task_result": [{"task": "general", "reason": "Người dùng chỉ chào hỏi, không cần gọi dữ liệu.", "status": "ok"}], "final_answer": "Chào anh/chị! Em có thể hỗ trợ gì cho anh/chị hôm nay ạ? Anh/chị muốn tìm hiểu về khóa học tiếng Anh nào không?", "tool_results": [{"task": "general", "reason": "Người dùng chỉ chào hỏi, không cần gọi dữ liệu.", "status": "ok"}], "action_context": "normal_question", "planner_decision": {"actions": [], "needs_clarification": false, "clarification_question": null}, "client_message_id": "1783531863955-user"}	2026-07-08 17:31:02.402924+00	2026-07-08 17:31:02.402924+00	\N
\.


--
-- TOC entry 4336 (class 0 OID 17923)
-- Dependencies: 268
-- Data for Name: class_schedules; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.class_schedules (class_id, schedule_name, start_time, end_time, id, created_at, updated_at, deleted_at) FROM stdin;
8c255c99-7ef4-4066-96a5-206961a8c97f	T2	18:00:00	20:00:00	f6d253ea-f1d6-4d76-b0f7-9811bb6cd151	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8c255c99-7ef4-4066-96a5-206961a8c97f	T4	18:00:00	20:00:00	853b8fd5-2ffe-4584-b3b0-38e5577fd1b6	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4316 (class 0 OID 17229)
-- Dependencies: 248
-- Data for Name: class_sessions; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.class_sessions (id, class_id, teacher_id, lesson_id, room_id, title, description, session_date, mode, meeting_url, status, note, created_at, updated_at, deleted_at, class_schedule_id, override_start_time, override_end_time) FROM stdin;
2519663d-035d-48b6-8920-fbf3b7344181	8c255c99-7ef4-4066-96a5-206961a8c97f	487777f7-086c-4a5d-820b-fdfaa3d70ec6	a6a84461-a3e4-489f-9c6a-e5ea0c2b8748	07a3f912-cf59-482f-ad69-030edb4a2f29	Buổi 1: Introduction	\N	2026-06-01	offline	\N	scheduled	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	f6d253ea-f1d6-4d76-b0f7-9811bb6cd151	\N	\N
5947febc-8c2d-4423-bc8a-5abf9af3662d	8c255c99-7ef4-4066-96a5-206961a8c97f	487777f7-086c-4a5d-820b-fdfaa3d70ec6	a25e5052-dced-4ff5-a557-ea7518ddfd0e	07a3f912-cf59-482f-ad69-030edb4a2f29	Buổi 2: Grammar Foundation	\N	2026-06-03	offline	\N	scheduled	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	853b8fd5-2ffe-4584-b3b0-38e5577fd1b6	\N	\N
8a5490a6-3606-4fc7-aa5c-b21044cc194d	8c255c99-7ef4-4066-96a5-206961a8c97f	487777f7-086c-4a5d-820b-fdfaa3d70ec6	4d657569-270c-4ea3-ba5a-2251dff54061	07a3f912-cf59-482f-ad69-030edb4a2f29	Buổi 3: Listening Practice	\N	2026-06-08	offline	\N	scheduled	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	f6d253ea-f1d6-4d76-b0f7-9811bb6cd151	\N	\N
\.


--
-- TOC entry 4331 (class 0 OID 17791)
-- Dependencies: 263
-- Data for Name: class_sessions_media; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.class_sessions_media (id, class_session_id, media_id, title, description, order_index, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4315 (class 0 OID 17185)
-- Dependencies: 247
-- Data for Name: class_students; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.class_students (id, class_id, student_id, enrollment_id, enrollment_status, enrolled_at, final_score, note, created_at, updated_at, deleted_at) FROM stdin;
79143d40-18c3-4314-af2c-d6c465397f39	8c255c99-7ef4-4066-96a5-206961a8c97f	0b449963-41de-45a8-9b03-d86c666a8fbf	\N	enrolled	2026-07-08 17:58:07.365972+00	\N	Seeded student in class	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
24dc2860-1fae-49ae-8977-52858b0940dd	8c255c99-7ef4-4066-96a5-206961a8c97f	34379d94-2dd2-495f-adcf-6173bd2a5253	\N	enrolled	2026-07-08 17:58:07.381023+00	\N	Seeded student in class	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
1aff9b30-f65c-4d80-9c05-19814d8e1820	8c255c99-7ef4-4066-96a5-206961a8c97f	53015e43-135b-4c40-9a31-a23e8eeae7c4	\N	enrolled	2026-07-08 17:58:07.389925+00	\N	Seeded student in class	2026-07-08 17:58:03.595193+00	2026-07-08 17:58:03.595193+00	\N
\.


--
-- TOC entry 4314 (class 0 OID 17149)
-- Dependencies: 246
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.classes (id, course_id, teacher_id, name, code, class_type, max_students, start_date, status, created_at, updated_at, deleted_at, room_id) FROM stdin;
8c255c99-7ef4-4066-96a5-206961a8c97f	11b00ea9-ce5e-44e5-8611-390f39cf19cc	487777f7-086c-4a5d-820b-fdfaa3d70ec6	IELTS Foundation T2/T4 Evening	CLS-IELTS-202606-001	offline	20	2026-06-01	ongoing	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
90301a84-c33e-41ff-8183-46250a21811f	98115417-dc54-4017-a670-3f7ab7a6ab82	487777f7-086c-4a5d-820b-fdfaa3d70ec6	TOEIC 650 Weekend	CLS-TOEIC-202606-001	hybrid	25	2026-06-07	planned	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
\.


--
-- TOC entry 4333 (class 0 OID 17838)
-- Dependencies: 265
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.conversation_participants (id, conversation_id, user_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4332 (class 0 OID 17823)
-- Dependencies: 264
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.conversations (id, type, title, class_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4294 (class 0 OID 16541)
-- Dependencies: 226
-- Data for Name: course_categories; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_categories (id, name, slug, description, status, created_at, updated_at, deleted_at) FROM stdin;
1c84e445-554d-45c5-8c96-b51b8755fafe	IELTS	ielts	\N	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8a33bb9d-6e65-4f92-a882-19f4c516ad52	TOEIC	toeic	\N	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
6a68868d-a132-4b19-8fcb-ba55f5fdbd7c	Giao tiếp	giao-ti-p	\N	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b1ba9c3c-df14-431a-b5b0-da509efaac31	Tiếng Anh trẻ em	ti-ng-anh-tr-em	\N	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0062d70a-bde4-4336-9be6-d07ade254f48	Business English	business-english	\N	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4312 (class 0 OID 17073)
-- Dependencies: 244
-- Data for Name: course_enrollments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_enrollments (id, user_id, student_id, course_id, order_id, order_item_id, enrollment_status, enrolled_at, completed_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4325 (class 0 OID 17556)
-- Dependencies: 257
-- Data for Name: course_media; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_media (id, course_id, media_id, media_type, order_index, is_primary, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4300 (class 0 OID 16685)
-- Dependencies: 232
-- Data for Name: course_modules; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_modules (id, course_id, title, description, order_index, status, created_at, updated_at, deleted_at, media_id) FROM stdin;
69faf992-88e0-4810-b87f-f418852da5a6	11b00ea9-ce5e-44e5-8611-390f39cf19cc	Module 1	Nội dung chương 1	0	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
ca3b065d-0958-42be-b5b7-082fe90f46af	11b00ea9-ce5e-44e5-8611-390f39cf19cc	Module 2	Nội dung chương 2	1	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
1424a188-05dc-4909-bf93-88fd4b8e8405	98115417-dc54-4017-a670-3f7ab7a6ab82	Module 1	Nội dung chương 1	0	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
576b4903-c68d-41fe-b2a9-f672cd338b89	98115417-dc54-4017-a670-3f7ab7a6ab82	Module 2	Nội dung chương 2	1	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
a5313574-4881-4757-9feb-76d69d344642	7b65405e-0c32-45e6-8a90-dcf926076dc5	Module 1	Nội dung chương 1	0	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
38bfe310-d3bf-487a-9346-4dc55fe2caa5	7b65405e-0c32-45e6-8a90-dcf926076dc5	Module 2	Nội dung chương 2	1	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
\.


--
-- TOC entry 4299 (class 0 OID 16664)
-- Dependencies: 231
-- Data for Name: course_outcomes; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_outcomes (id, course_id, outcome_text, order_index, created_at, updated_at, deleted_at) FROM stdin;
3576992c-a5ae-4802-bbbe-86263efd07f3	11b00ea9-ce5e-44e5-8611-390f39cf19cc	Nắm vững nền tảng kỹ năng chính	0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c0eb05da-1d0a-4c60-9368-2119777d5361	11b00ea9-ce5e-44e5-8611-390f39cf19cc	Sẵn sàng học lên cấp độ tiếp theo	1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
d8b74b18-ec4d-421a-bfef-b5beafbf2e6c	98115417-dc54-4017-a670-3f7ab7a6ab82	Nắm vững nền tảng kỹ năng chính	0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8b87a3e5-675b-4c1f-ac50-da25f95cc5a7	98115417-dc54-4017-a670-3f7ab7a6ab82	Sẵn sàng học lên cấp độ tiếp theo	1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
acaae5ba-1d9e-4ae2-a6dd-cc2c83484bfc	7b65405e-0c32-45e6-8a90-dcf926076dc5	Nắm vững nền tảng kỹ năng chính	0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
474a355f-57e8-4ba9-a306-f9bc666aa05f	7b65405e-0c32-45e6-8a90-dcf926076dc5	Sẵn sàng học lên cấp độ tiếp theo	1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4298 (class 0 OID 16649)
-- Dependencies: 230
-- Data for Name: course_requirements; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_requirements (id, course_id, requirement_text, order_index, created_at, updated_at, deleted_at) FROM stdin;
c4878f40-f004-4727-a7bf-262f09dda542	11b00ea9-ce5e-44e5-8611-390f39cf19cc	Hoàn thành bài kiểm tra đầu vào	0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e661678c-807c-4516-8b5d-1c233f38a69a	11b00ea9-ce5e-44e5-8611-390f39cf19cc	Có thời gian học tối thiểu 3 buổi mỗi tuần	1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
da80792c-0650-4229-8f6d-754c65b1acb6	98115417-dc54-4017-a670-3f7ab7a6ab82	Hoàn thành bài kiểm tra đầu vào	0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
abb1a40d-c92e-46b4-9d58-f2d1e481400d	98115417-dc54-4017-a670-3f7ab7a6ab82	Có thời gian học tối thiểu 3 buổi mỗi tuần	1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0ed4db43-64e5-41d2-9522-c2e08fb8a882	7b65405e-0c32-45e6-8a90-dcf926076dc5	Hoàn thành bài kiểm tra đầu vào	0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
1b34d0fd-f6f7-4665-b9a9-8dc0c9329448	7b65405e-0c32-45e6-8a90-dcf926076dc5	Có thời gian học tối thiểu 3 buổi mỗi tuần	1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4297 (class 0 OID 16630)
-- Dependencies: 229
-- Data for Name: course_tag_mappings; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_tag_mappings (id, course_id, tag_id, created_at, updated_at, deleted_at) FROM stdin;
0bb4a33a-eddd-4b2e-acef-510d774abb03	11b00ea9-ce5e-44e5-8611-390f39cf19cc	f7baf080-0843-4c85-849e-f9882f2f792d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
06b9ffd0-45f2-438e-b6db-0dba062184fb	11b00ea9-ce5e-44e5-8611-390f39cf19cc	441a6246-6ad2-4a25-ac26-7e2392f2f5cc	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
92637fcc-b773-4737-a376-3dc3aef0bf95	98115417-dc54-4017-a670-3f7ab7a6ab82	f7baf080-0843-4c85-849e-f9882f2f792d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
9a27bed4-b292-4c1b-96a3-574f93943203	98115417-dc54-4017-a670-3f7ab7a6ab82	441a6246-6ad2-4a25-ac26-7e2392f2f5cc	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ecf92151-d555-4834-a698-ab2debd02704	7b65405e-0c32-45e6-8a90-dcf926076dc5	f7baf080-0843-4c85-849e-f9882f2f792d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
2508cff1-296a-4fba-af3b-9a0695d2dac6	7b65405e-0c32-45e6-8a90-dcf926076dc5	441a6246-6ad2-4a25-ac26-7e2392f2f5cc	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4295 (class 0 OID 16557)
-- Dependencies: 227
-- Data for Name: course_tags; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_tags (id, name, slug, created_at, updated_at, deleted_at) FROM stdin;
b6fd055f-0632-44cd-bb15-c07611a5b151	mất gốc	m-t-g-c	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f7baf080-0843-4c85-849e-f9882f2f792d	luyện thi	luy-n-thi	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
61079770-6253-4b87-b436-17573be2d1d1	người đi làm	ng-i-i-l-m	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
441a6246-6ad2-4a25-ac26-7e2392f2f5cc	online	online	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
4a07564a-f1fd-4fb0-89b7-f4f55846c8a3	offline	offline	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ea5ab68d-4f17-42d9-a290-626c33e536fb	giao tiếp	giao-ti-p	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e16e7e20-f55d-43e6-b33d-89e24697764e	ngữ pháp	ng-ph-p	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b4f948a1-b44e-44f4-9cdb-2860aad5ad27	từ vựng	t-v-ng	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4305 (class 0 OID 16823)
-- Dependencies: 237
-- Data for Name: course_wishlists; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.course_wishlists (id, user_id, course_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4296 (class 0 OID 16591)
-- Dependencies: 228
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.courses (id, name, code, slug, description, target_level, output_goal, total_sessions, price, status, created_at, updated_at, deleted_at, category_id, mode) FROM stdin;
98115417-dc54-4017-a670-3f7ab7a6ab82	TOEIC 650+	TOEIC_650	toeic-650	\N	B1	\N	30	3900000.00	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	1c84e445-554d-45c5-8c96-b51b8755fafe	center
7b65405e-0c32-45e6-8a90-dcf926076dc5	English Communication Basic	COMM_BASIC	english-communication-basic	\N	A0	\N	24	3200000.00	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	1c84e445-554d-45c5-8c96-b51b8755fafe	center
11b00ea9-ce5e-44e5-8611-390f39cf19cc	IELTS Foundation	IELTS_FOUNDATION	ielts-foundation	\N	A1	\N	36	4500000.00	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:58:45.546236+00	\N	1c84e445-554d-45c5-8c96-b51b8755fafe	center
\.


--
-- TOC entry 4338 (class 0 OID 17971)
-- Dependencies: 270
-- Data for Name: guest_enrollments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.guest_enrollments (id, content, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4309 (class 0 OID 16965)
-- Dependencies: 241
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.invoice_items (id, invoice_id, course_id, item_name, item_code, unit_price, quantity, total_price, created_at, updated_at, deleted_at, class_id) FROM stdin;
\.


--
-- TOC entry 4308 (class 0 OID 16935)
-- Dependencies: 240
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.invoices (id, order_id, user_id, invoice_number, invoice_status, issued_at, paid_at, buyer_name, buyer_email, buyer_phone, billing_address, currency, subtotal_amount, discount_amount, total_amount, invoice_metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4302 (class 0 OID 16755)
-- Dependencies: 234
-- Data for Name: lesson_materials; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.lesson_materials (id, lesson_id, title, description, external_url, order_index, is_downloadable, created_by, created_at, updated_at, deleted_at, media_id) FROM stdin;
\.


--
-- TOC entry 4301 (class 0 OID 16709)
-- Dependencies: 233
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.lessons (id, course_id, module_id, title, description, content, order_index, estimated_duration_minutes, status, created_by, created_at, updated_at, deleted_at, media_id) FROM stdin;
a6a84461-a3e4-489f-9c6a-e5ea0c2b8748	11b00ea9-ce5e-44e5-8611-390f39cf19cc	69faf992-88e0-4810-b87f-f418852da5a6	Lesson 1: Introduction	Bài học mẫu	\N	0	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
4d657569-270c-4ea3-ba5a-2251dff54061	11b00ea9-ce5e-44e5-8611-390f39cf19cc	69faf992-88e0-4810-b87f-f418852da5a6	Lesson 2: Introduction	Bài học mẫu	\N	1	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
a25e5052-dced-4ff5-a557-ea7518ddfd0e	11b00ea9-ce5e-44e5-8611-390f39cf19cc	ca3b065d-0958-42be-b5b7-082fe90f46af	Lesson 1: Introduction	Bài học mẫu	\N	0	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
3c279d1c-52eb-4686-a948-634bf9093efb	11b00ea9-ce5e-44e5-8611-390f39cf19cc	ca3b065d-0958-42be-b5b7-082fe90f46af	Lesson 2: Introduction	Bài học mẫu	\N	1	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
bf5622b3-3703-48c7-8493-bffe66ea2132	98115417-dc54-4017-a670-3f7ab7a6ab82	1424a188-05dc-4909-bf93-88fd4b8e8405	Lesson 1: Introduction	Bài học mẫu	\N	0	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
42fb2fce-8037-44e2-8bf3-447daa967bb5	98115417-dc54-4017-a670-3f7ab7a6ab82	1424a188-05dc-4909-bf93-88fd4b8e8405	Lesson 2: Introduction	Bài học mẫu	\N	1	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
a5b644f1-3dd3-4d1e-824c-a6563d45d04d	98115417-dc54-4017-a670-3f7ab7a6ab82	576b4903-c68d-41fe-b2a9-f672cd338b89	Lesson 1: Introduction	Bài học mẫu	\N	0	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
fec94c0f-2eba-45c7-b964-1a474b63820d	98115417-dc54-4017-a670-3f7ab7a6ab82	576b4903-c68d-41fe-b2a9-f672cd338b89	Lesson 2: Introduction	Bài học mẫu	\N	1	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
0d79f4a2-77d4-4a8b-86bf-144e46119e25	7b65405e-0c32-45e6-8a90-dcf926076dc5	a5313574-4881-4757-9feb-76d69d344642	Lesson 1: Introduction	Bài học mẫu	\N	0	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
f527af56-8ce4-4ad3-80bd-cd6a71a89f12	7b65405e-0c32-45e6-8a90-dcf926076dc5	a5313574-4881-4757-9feb-76d69d344642	Lesson 2: Introduction	Bài học mẫu	\N	1	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
aebd4d46-4d22-485b-9a48-a42078094522	7b65405e-0c32-45e6-8a90-dcf926076dc5	38bfe310-d3bf-487a-9346-4dc55fe2caa5	Lesson 1: Introduction	Bài học mẫu	\N	0	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
2dc9c49b-4e73-4969-bf04-fdf9626920e7	7b65405e-0c32-45e6-8a90-dcf926076dc5	38bfe310-d3bf-487a-9346-4dc55fe2caa5	Lesson 2: Introduction	Bài học mẫu	\N	1	90	published	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N	\N
\.


--
-- TOC entry 4324 (class 0 OID 17539)
-- Dependencies: 256
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.media (id, bucket, object_name, original_filename, content_type, size, uploaded_by, created_at, updated_at, deleted_at, folder) FROM stdin;
980a4bb3-7597-4799-82ac-72f920b09547	materials	Tài liệu số 1/ae2ecc3f04734284824cd749eb5e8c14.pdf	Sơ đồ tư duy - sơ đồ bong bóng.pdf	application/pdf	11721919	211b0f76-c8e8-4dad-9827-155efeca5f1d	2026-07-10 04:43:39.546447+00	2026-07-10 04:43:39.546447+00	\N	Tài liệu số 1
\.


--
-- TOC entry 4307 (class 0 OID 16908)
-- Dependencies: 239
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.order_items (id, order_id, course_id, course_name, course_code, unit_price, quantity, total_price, created_at, updated_at, deleted_at, class_id) FROM stdin;
\.


--
-- TOC entry 4306 (class 0 OID 16871)
-- Dependencies: 238
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.orders (id, user_id, student_id, cart_id, order_code, invoice_number, status, currency, subtotal_amount, discount_amount, total_amount, note, payment_method, paid_at, cancelled_at, expired_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4310 (class 0 OID 17015)
-- Dependencies: 242
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.payments (id, order_id, invoice_id, user_id, provider, payment_method, status, amount, currency, provider_payment_id, provider_transaction_id, checkout_url, raw_request, raw_response, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4288 (class 0 OID 16430)
-- Dependencies: 220
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.permissions (id, code, name, description, created_at, updated_at, deleted_at) FROM stdin;
93b06265-9ebe-43f5-93d4-9919d116d042	admin.all	admin.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ab6a944e-c144-435e-80b2-6319c3c5c895	user.create	user.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
395e5298-3d1a-4b03-8707-2d06c4e1bdd9	user.read	user.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
07364ce9-935e-4eb5-ba93-efe298f8b149	user.update	user.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7c3b098f-0f1f-460b-bc5d-bad31142d7db	user.delete	user.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
dbe25088-3fa9-4692-8f7f-3d027a1e3b9d	user.all	user.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
4c33102b-8da6-4e07-b7bc-dc18575b869c	student.create	student.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
821befca-8e82-4dba-8f83-3632ce1908d2	student.read	student.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ae5d96f7-e45a-48f5-891f-ec778d87ff33	student.update	student.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
77cefaba-6d87-4293-a1ff-103f7cf17f4a	student.delete	student.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
d264f5c9-cb4e-4bd1-950d-99a732dc005a	student.all	student.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
43a72357-0a4b-4250-bd44-9962c63c589a	teacher.create	teacher.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
920cbad4-7941-431a-852a-ad2a264d65af	teacher.read	teacher.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e9749582-60c0-4501-9e4c-fea12ecfc815	teacher.update	teacher.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
2147fd71-5bc6-4889-9070-a9ba179a3a9f	teacher.delete	teacher.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
fb92e334-99e4-4aab-975f-2ba827576865	teacher.all	teacher.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
1126491a-8a71-4351-bac5-5426ccc91069	staff.create	staff.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
6a48b559-3ecb-497d-b5b6-ab1eef70455d	staff.read	staff.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e14be351-9df4-42e8-9904-b01c9379c335	staff.update	staff.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
fe98d5b9-8a4e-404a-aa71-f6c66ea8822f	staff.delete	staff.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7a22155a-5c47-4eeb-8586-fe0263104782	staff.all	staff.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
6f8ee75f-437b-460e-bdb9-3866cdf56bbe	role.create	role.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a79c0a6b-6b3f-4964-835c-f4c7fa1e0a91	role.read	role.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c21bb9a1-a52c-42d6-83f6-40ff6e1d2e4a	role.update	role.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ef8b667e-7f19-423a-a634-a5b09aea6fff	role.delete	role.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e50ba8be-719b-46f1-b3b1-bb70c0dc1a9c	role.all	role.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
656ac3b5-10c2-437a-8962-6859f315921d	permission.create	permission.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ae331c47-e0ef-4367-bb34-b6eb9911db69	permission.read	permission.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
809a0a31-e3e6-4552-ad0f-c1423d4cd3ab	permission.update	permission.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
231a44f5-fce7-4c2a-8800-dfd99c734f72	permission.delete	permission.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5545d4db-e26f-424b-b21c-0b727b06f5c1	permission.all	permission.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
bf18b6f5-8379-4a2b-b41d-1bfbb48cf8d7	course.create	course.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
35bc3974-17d8-450a-b3c4-d7ea58c1455c	course.read	course.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c1bb0514-29d2-4082-b69f-9fccb6aa9e26	course.update	course.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
dfcea9bb-3250-4421-a16e-c91e4a71fa59	course.delete	course.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c59b3a2d-70db-4424-bc4f-40b7ed0fe106	course.all	course.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b6a5bb4a-4aad-4a31-915d-10ee809b00a1	course_category.create	course_category.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5bac533-a623-46b1-8f31-51955691d0f4	course_category.read	course_category.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0fff7d6f-628c-499e-9d08-fbcf3a508f00	course_category.update	course_category.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
eafc8407-63d7-4a19-885e-65695bbcefbe	course_category.delete	course_category.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
27233af8-d905-45f5-9a0a-674efa3fdd78	course_category.all	course_category.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
2db92d58-1c9e-44a6-a3fb-c9b85de4881b	course_tag.create	course_tag.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c471107b-5551-4037-881f-403e6d4033c4	course_tag.read	course_tag.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
894701bb-a1a0-499e-9d00-adc2d5c4ee0d	course_tag.update	course_tag.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
3e7d73f6-eeea-47a4-98f4-3c4c37cc123b	course_tag.delete	course_tag.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
de50900a-55a3-4945-bb14-fc299b74b90f	course_tag.all	course_tag.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
82787ae4-d016-4801-b517-e18485bceec7	course_requirement.create	course_requirement.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
2c8dca66-cf07-44d6-a17e-8c93cdb2181a	course_requirement.read	course_requirement.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
125f324d-bc56-4f72-bdc5-475568a8f1ed	course_requirement.update	course_requirement.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
56c2c0cc-6a29-4365-84e9-e8fded3c19fe	course_requirement.delete	course_requirement.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
488d1948-387c-4426-a43d-05470506408c	course_requirement.all	course_requirement.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
95e95df5-af50-4ce9-bf0d-413964311ca9	course_outcome.create	course_outcome.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e4c47a80-fe11-4aec-95e5-6f571ef2aafd	course_outcome.read	course_outcome.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
cc166539-4b99-4103-8e60-664d1eda2a73	course_outcome.update	course_outcome.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a4c1681e-d67a-4594-b015-c2a2430a1404	course_outcome.delete	course_outcome.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8181945e-43a4-41fe-92c4-f364fd630a10	course_outcome.all	course_outcome.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a7179ef9-12b3-4641-807d-d95162a00a82	course_module.create	course_module.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
59cb7234-459b-46ab-91d3-90ce49283024	course_module.read	course_module.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
09a54443-27af-4cf2-9ed4-1030955f3937	course_module.update	course_module.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5e8588fc-a8e5-4e75-9464-7f779e884665	course_module.delete	course_module.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
3ffe5698-26e3-4013-8a42-65c345a469cd	course_module.all	course_module.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
271b0517-f893-4e3f-a9a8-bff8bce4e327	lesson.create	lesson.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
30c11077-d6a7-4b67-b1ae-3a7a971d8953	lesson.read	lesson.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5d889a1b-da34-49f4-a386-5b73dedef353	lesson.update	lesson.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
228de46b-4ce9-4100-b4e9-3ac9d939ea4a	lesson.delete	lesson.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a3feff66-3032-4f19-8506-c63b3cc59eab	lesson.all	lesson.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8f0f8763-1de8-45e6-ac16-c57fb4ec9dcf	lesson_material.create	lesson_material.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
54779d55-8a3b-4bac-b6a8-4d3fdcc3ca17	lesson_material.read	lesson_material.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
46041f89-be89-4acc-b303-80a4c18ba1f7	lesson_material.update	lesson_material.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
1fb3d6cb-1273-4c09-9304-284250004ebb	lesson_material.delete	lesson_material.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
1a2bca4d-cff7-49c0-af13-1e06b3250286	lesson_material.all	lesson_material.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
98ef495f-0a65-4de0-95de-15da6236a104	cart.create	cart.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e6263391-6418-48a7-8d0c-ccebd8763cdf	cart.read	cart.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0cbe2af3-80c8-4c24-95f3-73e75e29c660	cart.update	cart.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
9d24c711-e6eb-4dca-a73d-5969e9fedb11	cart.delete	cart.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
dc9ba45d-100a-4932-ae4f-86507421f21b	cart.all	cart.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7bd47334-ef1e-40d9-a09e-fbc15f883e51	wishlist.create	wishlist.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
05d78c31-a85a-4267-b57e-3317c4cec40a	wishlist.read	wishlist.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
d22a1210-2b87-46b4-9da0-82af6dd95f5f	wishlist.update	wishlist.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
1a4c0cc8-1405-4e08-8104-dffd30fd6b11	wishlist.delete	wishlist.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e023b999-d719-4a36-a691-9307d89ef7cd	wishlist.all	wishlist.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
6a90542b-ec15-46b8-b87b-6cf00116bb7d	order.create	order.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
53ccb9a4-bfc3-4c76-9913-36c01cfaeb4d	order.read	order.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7d0cad6c-9e4b-4757-b15f-a6671d12d7ff	order.update	order.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ddff2375-8bdf-463b-8f23-e199a796d05c	order.delete	order.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a6e4b07e-ae1b-48d3-98b5-e8e58fa3a833	order.all	order.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ea280e05-0eed-44d9-9cc7-a9f4298b55ad	invoice.create	invoice.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e1bc1ee1-e174-4f04-a3ef-12e34cb7d338	invoice.read	invoice.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7f217635-38b9-4bea-90a7-2e43fe3ea5a8	invoice.update	invoice.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b7fe024b-50e0-468f-b5c2-56a467d8246a	invoice.delete	invoice.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7eff552e-9b7d-46c3-955e-250066a254f1	invoice.all	invoice.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5f842db3-d797-4ed2-997d-851146e586a6	payment.create	payment.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5c88e6df-5703-40f0-84d1-05771f4fda93	payment.read	payment.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
93229795-08c5-413d-a8af-0269b5a83f0d	payment.update	payment.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
678c3c1d-5e0f-4bb0-8611-5028a25d9389	payment.delete	payment.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
aad0ea62-6c39-4204-b7ad-6a7eefa19347	payment.all	payment.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
cf56d76d-5eb5-4bb7-bd9d-d6ea4c78f3c0	sepay.create	sepay.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c4971a25-9237-4cc1-ac58-e46d600d9dc4	sepay.read	sepay.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
13086435-b6bb-4ca5-87fa-7359b4cd7a48	sepay.update	sepay.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
26362046-77de-46b6-acb4-e8c72e6404d2	sepay.delete	sepay.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
d7c7fe1b-c4e0-4fcd-8cec-37155cbcff25	sepay.all	sepay.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
1e6bf18c-4a6d-40d4-9f3e-e41a71665383	class.create	class.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
d44a8434-a5c5-4c95-a093-a1b519abfb8f	class.read	class.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
9707b737-b449-420f-9ef8-988057cd87c4	class.update	class.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
4fed1c97-98ad-4e3f-b270-b5844899b19e	class.delete	class.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5087eee1-f172-4d94-95d9-fc8f054c0374	class.all	class.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c2aa871a-ba5b-456b-8152-f819b53bea99	class_student.create	class_student.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
d2e170d7-84ff-4ff7-997c-5188223d532f	class_student.read	class_student.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
778a1607-9b80-4fdb-adb7-b1226bbfd0b7	class_student.update	class_student.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
13135fe4-4b2b-4b6a-aeff-5bb1348cdc1c	class_student.delete	class_student.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
6ce246fd-592c-4fc2-9835-0e9746c06ea4	class_student.all	class_student.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
20c07ff2-9c98-4a92-917d-5931bad66ff2	room.create	room.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
386b093a-cdfe-43f2-bdf9-b4b5add4fa27	room.read	room.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0c765dbb-b76e-4b10-b612-08a37851ea91	room.update	room.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
fd5f1bd8-ca16-42b6-80d0-fa5605ae00bf	room.delete	room.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
93b2472f-d188-495c-a408-1d85d92ed280	room.all	room.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
152f47e2-c6fa-44c4-85e0-752ff382f25d	class_session.create	class_session.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b52622b4-ba23-4b1b-9778-68c24e91757e	class_session.read	class_session.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
62c2049b-fe40-48f4-87e6-d4d795c5262c	class_session.update	class_session.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0f1c7c60-9612-4585-95de-000c6d4f2399	class_session.delete	class_session.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
58757780-8f57-4227-8aae-41e25d455299	class_session.all	class_session.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
da79ce8f-a0b1-4da2-b7bd-a5b55f25aa3b	class_session.sheadual.teacher.view	class_session.sheadual.teacher.view	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
39381597-3d85-4325-86b4-21ff10e2296a	class_sesion.sheadual.view	class_sesion.sheadual.view	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
4393500d-7a99-4a7e-8804-e1a5858f5c46	class_session.schedule.teacher.view	class_session.schedule.teacher.view	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
6cdab98b-a960-49bb-97cf-0d04fdeac983	class_session.schedule.view	class_session.schedule.view	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
73b889bf-88ca-47ac-a209-4b48471f61e9	attendance.create	attendance.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
da210fc7-e757-4dfc-ba71-1586a5a3d878	attendance.read	attendance.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
7d4b2aeb-2a68-4726-a69d-713f38e45dc5	attendance.update	attendance.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8f58b159-a30c-4612-9d1d-bea9572b58c2	attendance.delete	attendance.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
12d572bc-9d5d-4812-ab3c-9dcd824784a9	attendance.all	attendance.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b2674ab2-642a-438f-a86a-759090c01243	attendance_report.read	attendance_report.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
2840ed20-3d8c-4c97-8ac8-9315a92a3386	attendance_report.all	attendance_report.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
63f71713-fbcf-4d80-8a56-ce9f51685ca0	assignment.create	assignment.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
555c49be-c0ef-426a-9678-8801014f234c	assignment.read	assignment.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e18407e2-5661-4c57-a025-bc632a5a01ab	assignment.update	assignment.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
db4140f5-3a8d-454d-a420-745013bbf2e1	assignment.delete	assignment.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
cbb39534-74f4-412a-a71d-381fb88510f6	assignment.all	assignment.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a77839f0-07ab-4929-8538-7ad5fb99e8ed	assignment_type.create	assignment_type.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c70eb5c4-c84c-43c1-b3f4-d6a32c4ad662	assignment_type.read	assignment_type.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
dc413aa0-f259-4787-886c-9025c8f73f75	assignment_type.update	assignment_type.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
b4bd210b-c627-4a04-9720-cf5186ad17c5	assignment_type.delete	assignment_type.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ae039bee-2dd4-4ed1-b8f9-ccf4b4db5458	assignment_type.all	assignment_type.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
386c1957-93e3-44b5-9774-5887b62cff86	assignment_attachment.create	assignment_attachment.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
3d9113f4-abc7-41f0-89c4-d0ac5cc0bfc0	assignment_attachment.read	assignment_attachment.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
9ebf3805-33d7-4846-948f-737c5d859612	assignment_attachment.update	assignment_attachment.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
fbad1d2a-060e-42e2-9b29-ad7480427108	assignment_attachment.delete	assignment_attachment.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a945e19c-c548-4b32-98a7-3678f2c30257	assignment_attachment.all	assignment_attachment.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
2e9166f9-0a70-4d6b-8474-7f97a86f3f7f	assignment_submission.create	assignment_submission.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
884721d6-5001-4abd-ab22-378d022979d2	assignment_submission.read	assignment_submission.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
03b355ba-9987-44f5-9633-4e8cad6d891f	assignment_submission.update	assignment_submission.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a0827bda-107b-4dd9-a0e3-276361d996f6	assignment_submission.delete	assignment_submission.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f595c4d5-87ec-452f-bf17-ceeb495e0f2d	assignment_submission.all	assignment_submission.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
0f788d33-ddab-4655-ab27-211930e179be	submission_attachment.create	submission_attachment.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ce88df31-d5fe-48f1-bab7-1d7a50177a59	submission_attachment.read	submission_attachment.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e85aa091-f3c3-4382-9755-936bf69bfe6c	submission_attachment.update	submission_attachment.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
a83c7e3b-cb70-4741-8af5-dfb405548d8b	submission_attachment.delete	submission_attachment.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
549535cc-0227-4879-816a-6b798f2bce30	submission_attachment.all	submission_attachment.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8ab6e457-d383-4bc1-99f4-0577fd93ba8f	assignment_grade.create	assignment_grade.create	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8c7704eb-33e3-4e23-8eda-c6502cf377c5	assignment_grade.read	assignment_grade.read	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
65b37ceb-7d06-498b-9e70-63a7ea881476	assignment_grade.update	assignment_grade.update	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f4b0a225-1776-47ae-b551-8e438a1d014b	assignment_grade.delete	assignment_grade.delete	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
5d76ea98-7871-4822-be89-7574e028ed0f	assignment_grade.all	assignment_grade.all	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4290 (class 0 OID 16458)
-- Dependencies: 222
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.role_permissions (role_id, permission_id, created_at, updated_at, deleted_at) FROM stdin;
4881ad2f-6be0-4d2e-b51b-5cf20c812d87	93b06265-9ebe-43f5-93d4-9919d116d042	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	d264f5c9-cb4e-4bd1-950d-99a732dc005a	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	920cbad4-7941-431a-852a-ad2a264d65af	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	6a48b559-3ecb-497d-b5b6-ab1eef70455d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	395e5298-3d1a-4b03-8707-2d06c4e1bdd9	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	c59b3a2d-70db-4424-bc4f-40b7ed0fe106	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	27233af8-d905-45f5-9a0a-674efa3fdd78	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	de50900a-55a3-4945-bb14-fc299b74b90f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	3ffe5698-26e3-4013-8a42-65c345a469cd	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	a3feff66-3032-4f19-8506-c63b3cc59eab	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	1a2bca4d-cff7-49c0-af13-1e06b3250286	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	e6263391-6418-48a7-8d0c-ccebd8763cdf	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	05d78c31-a85a-4267-b57e-3317c4cec40a	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	a6e4b07e-ae1b-48d3-98b5-e8e58fa3a833	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	7eff552e-9b7d-46c3-955e-250066a254f1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	aad0ea62-6c39-4204-b7ad-6a7eefa19347	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	c4971a25-9237-4cc1-ac58-e46d600d9dc4	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	5087eee1-f172-4d94-95d9-fc8f054c0374	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	6ce246fd-592c-4fc2-9835-0e9746c06ea4	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	93b2472f-d188-495c-a408-1d85d92ed280	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	58757780-8f57-4227-8aae-41e25d455299	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	12d572bc-9d5d-4812-ab3c-9dcd824784a9	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	2840ed20-3d8c-4c97-8ac8-9315a92a3386	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	da79ce8f-a0b1-4da2-b7bd-a5b55f25aa3b	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	39381597-3d85-4325-86b4-21ff10e2296a	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	4393500d-7a99-4a7e-8804-e1a5858f5c46	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	6cdab98b-a960-49bb-97cf-0d04fdeac983	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	cbb39534-74f4-412a-a71d-381fb88510f6	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	a945e19c-c548-4b32-98a7-3678f2c30257	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	884721d6-5001-4abd-ab22-378d022979d2	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	8c7704eb-33e3-4e23-8eda-c6502cf377c5	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	821befca-8e82-4dba-8f83-3632ce1908d2	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	920cbad4-7941-431a-852a-ad2a264d65af	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	e9749582-60c0-4501-9e4c-fea12ecfc815	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	35bc3974-17d8-450a-b3c4-d7ea58c1455c	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	59cb7234-459b-46ab-91d3-90ce49283024	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	30c11077-d6a7-4b67-b1ae-3a7a971d8953	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	54779d55-8a3b-4bac-b6a8-4d3fdcc3ca17	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	5d889a1b-da34-49f4-a386-5b73dedef353	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	8f0f8763-1de8-45e6-ac16-c57fb4ec9dcf	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	46041f89-be89-4acc-b303-80a4c18ba1f7	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	d44a8434-a5c5-4c95-a093-a1b519abfb8f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	d2e170d7-84ff-4ff7-997c-5188223d532f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	b52622b4-ba23-4b1b-9778-68c24e91757e	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	73b889bf-88ca-47ac-a209-4b48471f61e9	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	da210fc7-e757-4dfc-ba71-1586a5a3d878	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	7d4b2aeb-2a68-4726-a69d-713f38e45dc5	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	b2674ab2-642a-438f-a86a-759090c01243	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	63f71713-fbcf-4d80-8a56-ce9f51685ca0	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	555c49be-c0ef-426a-9678-8801014f234c	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	e18407e2-5661-4c57-a025-bc632a5a01ab	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	db4140f5-3a8d-454d-a420-745013bbf2e1	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	a945e19c-c548-4b32-98a7-3678f2c30257	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	884721d6-5001-4abd-ab22-378d022979d2	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	8ab6e457-d383-4bc1-99f4-0577fd93ba8f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	8c7704eb-33e3-4e23-8eda-c6502cf377c5	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	65b37ceb-7d06-498b-9e70-63a7ea881476	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	821befca-8e82-4dba-8f83-3632ce1908d2	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	35bc3974-17d8-450a-b3c4-d7ea58c1455c	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	59cb7234-459b-46ab-91d3-90ce49283024	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	30c11077-d6a7-4b67-b1ae-3a7a971d8953	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	54779d55-8a3b-4bac-b6a8-4d3fdcc3ca17	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	dc9ba45d-100a-4932-ae4f-86507421f21b	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	e023b999-d719-4a36-a691-9307d89ef7cd	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	6a90542b-ec15-46b8-b87b-6cf00116bb7d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	53ccb9a4-bfc3-4c76-9913-36c01cfaeb4d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	7d0cad6c-9e4b-4757-b15f-a6671d12d7ff	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	e1bc1ee1-e174-4f04-a3ef-12e34cb7d338	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	5f842db3-d797-4ed2-997d-851146e586a6	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	5c88e6df-5703-40f0-84d1-05771f4fda93	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	d44a8434-a5c5-4c95-a093-a1b519abfb8f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	d2e170d7-84ff-4ff7-997c-5188223d532f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	b52622b4-ba23-4b1b-9778-68c24e91757e	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	da210fc7-e757-4dfc-ba71-1586a5a3d878	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	b2674ab2-642a-438f-a86a-759090c01243	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	555c49be-c0ef-426a-9678-8801014f234c	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	2e9166f9-0a70-4d6b-8474-7f97a86f3f7f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	884721d6-5001-4abd-ab22-378d022979d2	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	03b355ba-9987-44f5-9633-4e8cad6d891f	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	0f788d33-ddab-4655-ab27-211930e179be	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	ce88df31-d5fe-48f1-bab7-1d7a50177a59	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	a83c7e3b-cb70-4741-8af5-dfb405548d8b	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	8c7704eb-33e3-4e23-8eda-c6502cf377c5	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	93229795-08c5-413d-a8af-0269b5a83f0d	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4287 (class 0 OID 16419)
-- Dependencies: 219
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.roles (id, name, description, created_at, updated_at, deleted_at) FROM stdin;
4881ad2f-6be0-4d2e-b51b-5cf20c812d87	admin	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
90b8a698-c5e6-48b4-89ff-4689b7b83eed	staff	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
97ab9597-0b6d-4b46-9ea8-0feed92eaf56	teacher	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
f5daa727-3824-49e1-b231-06724a7a2fdd	student	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4313 (class 0 OID 17117)
-- Dependencies: 245
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.rooms (id, name, capacity, location, status, created_at, updated_at, deleted_at) FROM stdin;
07a3f912-cf59-482f-ad69-030edb4a2f29	Room A101	20	Floor A1	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
e2e678a6-1a24-4f56-a87e-c55090b2d2db	Room A102	25	Floor A1	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
ebd39a99-ff68-488e-99ed-c73d5164be1e	Room B201	30	Floor B2	active	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
\.


--
-- TOC entry 4311 (class 0 OID 17044)
-- Dependencies: 243
-- Data for Name: sepay_ipn_logs; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.sepay_ipn_logs (id, order_id, payment_id, invoice_number, notification_type, sepay_order_id, sepay_transaction_id, transaction_status, payload, headers, is_valid, processed_at, error_message, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4293 (class 0 OID 16520)
-- Dependencies: 225
-- Data for Name: staff_profiles; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.staff_profiles (id, user_id, "position", department, note, created_at, updated_at, deleted_at) FROM stdin;
2fa8be76-1694-4d88-88f2-0427a65c5bad	211b0f76-c8e8-4dad-9827-155efeca5f1d	Quản lý	Nhân sự	\N	2026-07-08 17:49:10.142067+00	2026-07-08 17:49:10.142067+00	\N
\.


--
-- TOC entry 4291 (class 0 OID 16487)
-- Dependencies: 223
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.students (id, user_id, date_of_birth, gender, address, level, learning_goal, parent_name, parent_phone, created_at, updated_at, deleted_at) FROM stdin;
0b449963-41de-45a8-9b03-d86c666a8fbf	e270724d-7e71-44b5-aefb-59bba9ff1007	\N	\N	\N	\N	\N	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
34379d94-2dd2-495f-adcf-6173bd2a5253	f3a96be0-f34d-4df8-82c6-03b39db75217	\N	\N	\N	\N	\N	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
53015e43-135b-4c40-9a31-a23e8eeae7c4	c30d60ca-1563-415f-8be2-79a732642ee9	2002-05-14	male	Quận 1, TP. Hồ Chí Minh	intermediate	Luyện thi IELTS đạt 7.5 để đi du học	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
b681f61d-0d65-4599-af7e-05cb0c084bd0	d8d8a411-0d3c-4e26-ac64-6931a3db7e1d	1998-11-23	female	Cầu Giấy, Hà Nội	advanced	Tiếng Anh giao tiếp thương mại phục vụ công việc	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
5cb0ee4e-bf04-4836-a635-3ae1d74b9792	f813b900-72a7-415d-9ebe-0dff0a48e949	2012-08-19	male	Hải Châu, Đà Nẵng	beginner	Luyện thi chứng chỉ Cambridge Flyers	Phạm Minh Hùng	0905999888	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
13caa8c8-7447-4fe9-b766-a145acc33563	539b96cb-c786-46a3-86ea-fb3d182fb09e	2005-03-02	male	Ninh Kiều, Cần Thơ	elementary	Luyện thi TOEIC lấy bằng tốt nghiệp đại học	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
40380274-8d01-41f3-ba2d-428872023b7f	f529f24f-277d-440d-a4a5-4314d26b4d7e	2001-09-30	female	Biên Hòa, Đồng Nai	intermediate	Cải thiện kỹ năng Nghe và Nói phản xạ	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
63e77490-cd85-4c25-97fb-756245a81728	b5df9194-f4f8-4bb4-bda7-988518986cf6	1995-02-12	male	Vũng Tàu, Bà Rịa - Vũng Tàu	beginner	Xóa mất gốc tiếng Anh để chuyển việc	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
09a36330-5417-433c-b70c-c2c4f6ac200a	29d95c82-f5a1-49ea-9739-e2f061c5fa22	2009-07-07	female	Thanh Xuân, Hà Nội	intermediate	Ôn thi vào lớp 10 chuyên Anh	Nguyễn Thúy Hạnh	0961999888	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6bd21278-0dcf-4561-a653-c41345d5a3de	6aba2fbb-d11c-4262-9f25-5a84e58124fb	2004-12-05	male	Thủ Đức, TP. Hồ Chí Minh	advanced	Luyện thi SAT để nộp hồ sơ học bổng Mỹ	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
aab363f7-5b02-4a53-b8e8-76a87bd53cc3	258d0099-07db-4ada-981f-27a8c3b014ee	1997-04-18	female	Hồng Bàng, Hải Phòng	intermediate	Chuẩn bị tiếng Anh định cư nước ngoài	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c2d84409-43ab-40ce-a962-1a1c28ebcff3	8447f109-d72c-42dd-80f8-e05828d63b90	2003-01-25	male	Vinh, Nghệ An	elementary	Học tiếng Anh để đọc hiểu tài liệu IT	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d44fdb0e-34fe-4f41-aa47-f76962983db9	9d9013d0-43f6-4273-8779-e4f587349d1f	2000-08-08	female	Quận 3, TP. Hồ Chí Minh	intermediate	Luyện thi VSTEP đạt chứng chỉ B2	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
acd18015-959c-4b5c-9f7a-11236333ec9d	4be83706-2c49-4b45-bfef-27b4e675b7d0	2014-10-12	male	Thanh Khê, Đà Nẵng	beginner	Học tiếng Anh thiếu nhi tăng cường giao tiếp	Dương Quốc Trọng	0903111222	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
27a3d10a-9d5f-4dc2-b41f-65a856cae0b8	9b1a3671-f47e-4106-8b01-3047aba72faa	1999-06-15	female	Quận 7, TP. Hồ Chí Minh	advanced	Học thuyết trình tiếng Anh trước đám đông	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9daf3d3b-c11a-429c-8070-69ee683cf422	d8386127-cb2a-4f13-877a-8b5e46aa357c	2006-02-28	male	Ba Đình, Hà Nội	intermediate	Ôn thi THPT Quốc gia khối D01 đạt 9+	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
dba486ec-0ff9-4de5-8250-301dc4034de9	4c77c271-e6d3-4782-a1a7-d53c0c9ba236	2011-03-17	female	Nha Trang, Khánh Hòa	elementary	Học tiếng Anh bổ trợ kiến thức trên lớp	Trịnh Đình Khang	0966111222	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
1b527d8d-a878-48da-9ae1-874969e84320	c3bd91a7-6cfc-4134-86fe-1d086b93d39f	2002-12-12	male	Bình Thạnh, TP. Hồ Chí Minh	intermediate	Luyện thi TOEIC Đọc - Nghe mục tiêu 800	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6c0ad9e6-f165-4476-b5e4-e72b05ed23d1	853f65c1-5009-45af-83e6-2a186e7bc901	1994-07-20	female	Đống Đa, Hà Nội	advanced	Tiếng Anh chuyên ngành nhân sự (HR)	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c03bf0c4-e020-4f3d-add1-70cad269b450	0e09bdd1-35e4-4183-a8e1-1af557f5c6fc	2008-01-05	male	Buôn Ma Thuột, Đắk Lắk	elementary	Luyện thi IELTS sớm từ cấp 3	Mai Xuân Thành	0919222333	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
05cddafe-ba0a-4f91-ac6e-46eabadcd188	38d70d9d-5f84-4a0e-a2ab-09e493c51cdf	1996-10-10	female	Vũng Tàu	beginner	Học phát âm chuẩn IPA cơ bản	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
3fea21f9-410d-45b8-9084-680e59d64174	d048d4f2-faa6-4332-a901-8be32dbad239	2001-04-14	male	Quận Phú Nhuận, TP. Hồ Chí Minh	intermediate	Luyện kỹ năng Viết và Nói luận thuật	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
7ccd71e3-49ae-4494-aefe-65294c653b82	2db2c757-bcc6-461d-808c-e6015bba8f5b	2005-09-11	female	Thanh Hóa	intermediate	Học tiếng Anh giao tiếp đời sống hàng ngày	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
b50d929f-4fe3-48f0-80fd-a1331357ee70	6f32c9eb-cfef-479e-a152-1b69ff91a599	1993-03-24	male	Hoàn Kiếm, Hà Nội	advanced	Nâng cao từ vựng đàm phán hợp đồng thương mại	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
740a24bc-b78b-4cd5-83b1-8526670bb92a	d4ebcbf6-020c-4a5f-bb49-9afe208b6563	2010-12-01	female	Tuy Hòa, Phú Yên	beginner	Xây dựng lại gốc ngữ pháp căn bản	Lê Văn Tám	0973111222	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
02b1b564-73c1-448d-9aad-5fd50db14d09	a70a9b61-cc48-4800-8e52-49f28d2f725d	2004-06-18	male	Quận Tân Bình, TP. Hồ Chí Minh	intermediate	Thi chứng chỉ Cambridge B2 First (FCE)	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
1c5e0a61-2a4e-498f-9852-9f9d2fd97db9	fdb4556c-ccee-4625-a79d-2534eb0ab8a6	1999-01-30	female	Lào Cai	intermediate	Tiếng Anh chuyên ngành du lịch và khách sạn	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
7690f289-d2ec-48de-be73-2659b7eedf8f	f95f2c5d-7f1e-4a02-b775-c300ac22549a	2003-08-14	male	Thái Nguyên	elementary	Cải thiện kỹ năng làm bài đọc TOEIC	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
8254ede1-6062-4055-9a18-2760f9f8c1f0	abb882bd-e255-4dba-8b40-455b5706b636	2007-05-25	female	Hà Đông, Hà Nội	intermediate	Luyện thi nói và viết phục vụ thi IELTS	Đặng Đình Tiến	0983111222	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
29923d34-8fb1-4040-a2ef-eb35b0a1e1ce	641c27bb-de6f-4b8c-9f69-ecfe76c07e9a	2000-11-03	male	Quận 10, TP. Hồ Chí Minh	advanced	Luyện nói chuyên sâu bàn luận các chủ đề kinh tế	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
97d3b946-61e4-421c-9ae1-098fbfe704db	72b9ff4b-4a1c-4018-bab4-c32a698b8b4f	1995-09-17	female	Hạ Long, Quảng Ninh	intermediate	Tiếng Anh giao tiếp công sở hằng ngày	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f410e2a7-c387-46be-b300-fcfd9aeeca30	eee2c340-04ee-4892-af4a-1cf234849be2	2013-04-22	male	Rạch Giá, Kiên Giang	beginner	Luyện phản xạ nghe nói tiếng Anh thiếu nhi	Đỗ Tấn Tài	0966677881	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
030b3d42-758a-4937-bd5c-83f05fde4010	5eb1840e-7019-45ba-b360-bfaa4cabc815	2006-07-14	female	Huế	intermediate	Luyện thi đại học môn tiếng Anh khối D	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
281b3491-79d7-409f-bbf8-deafd4134037	e73e4904-2c23-4d4a-81e4-12703649a7ef	1997-02-11	male	Quận Gò Vấp, TP. Hồ Chí Minh	beginner	Học tiếng Anh lại từ đầu cho người đi làm	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
10d63f76-0461-4a7c-bea3-e556608fdec5	5a431fb2-6184-4c29-a833-f29955ab593f	2009-08-25	female	Long Xuyên, An Giang	elementary	Củng cố ngữ pháp căn bản cấp học trung học	Lý Văn Minh	0919900114	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
2efa6b03-52e2-407a-806e-963450110cc6	9e3a0e75-32e5-48e1-abe3-f9342aad7281	2002-05-19	male	Nam Định	intermediate	Luyện nghe nói để làm việc với khách nước ngoài	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9fe77567-2bc5-40b8-b66a-f0d733fd5afe	650d2a90-7b65-41ea-a2b0-14373e4ab9b6	1998-12-04	female	Quận Bình Tân, TP. Hồ Chí Minh	intermediate	Học tiếng Anh viết CV và phỏng vấn xin việc	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
2dce58ff-a062-4e02-a7ce-82a1867e8c3d	449014e8-b9da-47b0-895e-c9997f29a94d	2004-10-29	male	Bắc Ninh	advanced	Nâng band điểm IELTS Academic lên 8.0	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
29b43850-e540-4af5-aa03-39035bb596ba	cb2e6990-7057-4878-8680-5c9e735be0c9	2012-02-14	female	Gia Lâm, Hà Nội	beginner	Luyện ngữ pháp căn bản và từ vựng tiểu học	Bùi Văn Nam	0962345670	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f1d3aa12-4133-475d-be96-9a8dff29838d	90f1b664-cbd3-452e-af07-f0153099585f	2001-09-08	male	Thái Bình	intermediate	Tập trung cải thiện phản xạ giao tiếp phản biện	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c2d48b3d-ed5d-4d94-abfd-dfc894c4664b	fcd8cbc1-faaa-4f19-a1c1-141843169e9b	1996-05-18	female	Quận Phú Nhuận, TP. Hồ Chí Minh	advanced	Học tiếng Anh chuẩn bị đi công tác nước ngoài	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
0737320e-f988-4929-9e68-d1adc5b69524	43eafcab-9226-459b-9b8c-f7047c8f928f	2005-06-21	male	Tây Hồ, Hà Nội	elementary	Luyện thi nói phát âm chuẩn Mỹ	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
faaa6862-34f3-4f40-a91d-7a6a55060a01	515e40fe-d9ea-460a-b80f-972986b14321	2011-11-11	female	Quy Nhơn, Bình Định	beginner	Xây dựng đam mê học tiếng Anh qua bài hát, phim	Đỗ Hoàng Hải	0926789014	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
efdfa38a-7e2f-4a87-9763-9bc64ffc2314	fac964f1-d155-4869-a9b6-5b33e57d6c43	2003-03-05	male	Quận 5, TP. Hồ Chí Minh	intermediate	Luyện giải đề TOEIC định dạng mới cập nhật	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
a9385f9c-a931-46a3-b25c-1492537d6825	84e95a1f-d014-4b73-9d68-644354f2449f	1994-12-25	female	Phủ Lý, Hà Nam	beginner	Lấy lại kiến thức cơ bản để tự tin nói chuyện	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
fa26bc43-0ed0-4070-ab18-60a9e2a271a7	db6374cf-42b7-4e4a-9fe0-a3807ff8912a	2008-04-09	female	Quận 12, TP. Hồ Chí Minh	intermediate	Ôn luyện kiến thức ngữ pháp thi học sinh giỏi	Lý Văn Nam	0915566770	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
4d716fa1-b4b3-478e-a21c-1e82d5c63ed7	deac1459-3425-4ca4-a435-48784d8b6970	2002-09-14	male	Hải Dương	advanced	Nâng band điểm viết IELTS phục vụ nghiên cứu khoa học	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9a085d69-5852-4138-96cf-c67d4022fadf	e99ee470-026a-4756-9bf3-a812b06dec69	2014-01-20	female	Thanh Xuân, Hà Nội	beginner	Học tiếng Anh chuẩn Cambridge Starters	Nguyễn Hoàng Bách	0937788993	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f7c0941f-5288-4819-b60d-fcb3d4faf878	700331c0-73b6-476f-bd90-3ee341a76b62	2000-07-27	male	Quận Tân Phú, TP. Hồ Chí Minh	intermediate	Luyện nghe nói chuẩn bị làm việc công ty đa quốc gia	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
00dc97e7-ed80-4c4c-a22d-0df39a78ccaf	7fb29c17-e239-4d84-ab6f-7e7b3a2adaa9	1998-03-08	female	Long Biên, Hà Nội	intermediate	Tiếng Anh ngành tài chính ngân hàng	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
fa4bb67b-0c44-40b9-968c-c52d40bb9ff6	f6eb0299-9b64-4a8e-937d-b4af44b3f5c8	2006-11-20	male	Thừa Thiên Huế	elementary	Học tiếng Anh viết bài và giao tiếp căn bản	\N	\N	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
a2608c5c-97ea-4afd-8f89-290be1e203dd	62f0f93b-1411-4b0c-bbc0-59aebb7cdf54	2009-02-18	female	Hà Đông, Hà Nội	intermediate	Luyện thi chứng chỉ Cambridge PET	Nguyễn Minh Đức	0907766557	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
\.


--
-- TOC entry 4330 (class 0 OID 17752)
-- Dependencies: 262
-- Data for Name: submission_answer_media; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.submission_answer_media (id, submission_answer_id, media_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4329 (class 0 OID 17729)
-- Dependencies: 261
-- Data for Name: submission_answers; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.submission_answers (id, submission_id, question_id, answer_text, selected_option_ids, is_correct, score, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4321 (class 0 OID 17456)
-- Dependencies: 253
-- Data for Name: submission_attachments; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.submission_attachments (id, submission_id, title, file_bucket, file_object_name, original_filename, content_type, file_size, uploaded_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4292 (class 0 OID 16503)
-- Dependencies: 224
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.teachers (id, user_id, specialization, bio, experience_years, certificates, hourly_rate, created_at, updated_at, deleted_at) FROM stdin;
487777f7-086c-4a5d-820b-fdfaa3d70ec6	8eac94e2-8b88-47a2-a63d-388fa488db49	IELTS	\N	3	\N	\N	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
c4814cc7-76d2-4d93-85c6-a46d59f24db8	82d4f5b7-4aa4-4a85-a0ab-0c3473ea7442	\N	\N	0	null	\N	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
5d91c6c7-60a1-49a6-a843-c3091b05c328	94b40f2f-3e9e-4afc-872b-3a7f76a89bda	IELTS Academic	Giảng viên thạc sĩ ngôn ngữ Anh với hơn 5 năm kinh nghiệm luyện thi IELTS chuyên sâu.	5	["IELTS 8.5", "TESOL"]	350000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
eded975a-f446-436c-a394-c8ea4cb9c170	1b2dbed5-218c-448d-8881-98f1f8f218fe	TOEIC & Giao tiếp	Chuyên gia luyện thi TOEIC cấp tốc cam kết đầu ra 750+ cho người mất gốc.	4	["TOEIC 990", "CELTA"]	250000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
7b6baa34-2ed0-479a-8190-bbd99bb340a4	0ba3fe9a-600d-4623-b888-a7f21d2bb537	Tiếng Anh Trẻ Em	Yêu trẻ, năng động, phương pháp dạy học qua trò chơi kích thích tư duy phản xạ.	2	["TKT (Teaching Knowledge Test)"]	200000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
a3991692-89fd-42cd-8b51-7b141ea9cddd	20694269-7362-43f4-a46a-bdbb5674fa42	SAT & Linh vực Du học	Cựu du học sinh Mỹ, hỗ trợ săn học bổng và luyện thi chứng chỉ học thuật chuẩn hóa.	6	["SAT 1550/1600", "IELTS 8.0"]	500000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
90805542-4f9f-41dd-9cf7-6bfc90e03657	bece78c6-c04c-4ebc-8996-2b72b83364e1	Tiếng Anh Giao Tiếp Doanh Nghiệp	\N	3	["TOEIC 920"]	300000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
98219353-9d85-4747-8115-666d3ed8239a	180ff5a2-0961-4c31-932c-f907d1db2c23	IELTS Writing & Speaking	Tập trung sửa lỗi phát âm và nâng band điểm viết học thuật logic.	7	["IELTS 8.5", "TESOL"]	400000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
81720a68-6d61-424d-8091-b755d9c5c114	05432c86-d9db-4d48-a998-496ccac6eec8	Luyện Thi THPT Quốc Gia	Giảng viên trường chuyên với hệ thống bài tập bám sát cấu trúc đề thi của Bộ Giáo Dục.	10	["Bằng Thạc Sĩ Sư Phạm Anh"]	300000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
5a09e894-2373-49cd-b80f-60eaf370f0a0	70b65949-f12e-4f98-90ec-6935eb1a54fd	Tiếng Anh Tổng Quát	Giúp học viên xây dựng nền tảng từ số 0, lấy lại tự tin giao tiếp cơ bản.	1	null	150000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
567389e9-453f-4e82-a7e0-3442933e48dd	656d8e8f-bfbc-4227-bb77-457b4c748a49	IELTS Listening & Reading	Chia sẻ phương pháp Skimming & Scanning ăn trọn điểm tuyệt đối 9.0 hai kỹ năng nghe đọc.	4	["IELTS 8.0"]	280000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
fe814946-1cba-448c-b029-c6fc2a96e335	2557ff30-d953-4756-a537-a5edb6c6ebb9	Business English	\N	2	["TOEIC 880"]	220000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
64e4d2a0-a2fb-403c-9879-31f90d1154fb	59c52076-eea4-4426-8caf-b90449b54ef6	Phát Âm Chuẩn Mỹ (Accent Training)	Chuyên sửa ngọng, luyện phát âm chuẩn IPA và ngữ điệu tự nhiên như người bản xứ.	5	["TESOL Advanced", "IELTS Speaking 8.5"]	320000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
26607286-6344-4672-9b35-6919826300dc	75639ad6-9613-416d-b96a-7fb42200853e	Luyện Thi VSTEP	Hỗ trợ học viên đạt chứng chỉ B1, B2, C1 chuẩn khung năng lực ngoại ngữ VN nhanh chóng.	3	["VSTEP C1", "TOEIC 900"]	260000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
ff703228-ca15-476e-8eaf-f70680088692	4574b029-c824-44a4-901d-d379417eeac1	Tiếng Anh Giao Tiếp Phản Xạ	Tạo môi trường 100% tiếng Anh giúp học viên phá vỡ rào cản sợ nói.	2	["CELTA"]	240000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
cacfd17e-da97-4fb9-aa23-75e382ac9543	0a71e575-0eec-441d-b9f9-6e6c0eb27bc2	IELTS Academic Focus	Cựu giám khảo chấm thi thử, tập trung bóc tách tiêu chí chấm điểm để tối ưu hóa band.	8	["IELTS 8.5", "DELTA"]	450000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
dff4f7cb-7bdd-4e83-8c9d-194ff1651112	c9fc718f-783e-4ced-aa60-fd6dea910121	Cambridge English (KET/PET/FCE)	Kinh nghiệm ôn luyện chứng chỉ quốc tế Cambridge cho học sinh tiểu học và trung học.	4	["FCE Grade A", "TESOL"]	270000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
7d25dfe1-326f-433f-a573-f1d27d24d5e4	83af13c0-57b1-4f93-89db-bb9957a20bda	TOEIC 4 Kỹ Năng	Phương pháp học từ vựng qua Mindmap và tăng cường kỹ năng Nghe - Nói công sở.	3	["TOEIC 950"]	250000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
2c04f616-5be9-4caa-820e-8999fcbbfda3	6bb7b473-85f6-461b-9aa7-f54fc8d588ef	Tiếng Anh Cho Người Đi Làm	Thiết kế lộ trình học cá nhân hóa cho người bận rộn, tập trung vào viết Email, đàm phán.	6	["IELTS 7.5", "Business English Certificate"]	350000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
e2a1aa84-18f4-4df6-9d5e-a46a79ec1b94	090fd818-960a-45d0-9dda-4428f33eaf95	Ngữ Pháp & Từ Vựng Chuyên Sâu	Hệ thống hóa toàn bộ ngữ pháp tiếng Anh cốt lõi một cách khoa học dễ nhớ.	5	["TOEIC 910"]	200000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
caad5c41-508f-45d9-93e1-b4ed9c4d4849	d5d10e33-64d2-4089-b837-93a14c4ea011	IELTS Foundation	Phù hợp cho học viên mất gốc muốn bắt đầu chặng đường chinh phục IELTS từ 0 đến 5.0.	2	["IELTS 7.5"]	230000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
123b1468-189a-4460-870a-c5c4445e793f	320b519a-92ec-4892-ade0-04f6c09cb4d2	Academic Writing	Tư duy phản biện và cấu trúc bài luận học thuật chuẩn mực cho các kỳ thi quốc tế.	9	["Master of Arts in TESOL", "IELTS 8.5"]	480000.00	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
0340f661-71f3-40f5-9cd7-0c8bc3b50f2d	f7512879-e897-4020-9887-a96a6226e1aa	\N	\N	0	null	\N	2026-07-08 17:56:30.457735+00	2026-07-08 17:56:30.457735+00	\N
\.


--
-- TOC entry 4289 (class 0 OID 16441)
-- Dependencies: 221
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.user_roles (user_id, role_id, created_at, updated_at, deleted_at) FROM stdin;
211b0f76-c8e8-4dad-9827-155efeca5f1d	4881ad2f-6be0-4d2e-b51b-5cf20c812d87	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
8eac94e2-8b88-47a2-a63d-388fa488db49	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 16:40:31.692732+00	2026-07-08 16:40:31.692732+00	\N
211b0f76-c8e8-4dad-9827-155efeca5f1d	90b8a698-c5e6-48b4-89ff-4689b7b83eed	2026-07-08 17:49:10.142067+00	2026-07-08 17:49:10.142067+00	\N
e270724d-7e71-44b5-aefb-59bba9ff1007	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f3a96be0-f34d-4df8-82c6-03b39db75217	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c30d60ca-1563-415f-8be2-79a732642ee9	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d8d8a411-0d3c-4e26-ac64-6931a3db7e1d	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f813b900-72a7-415d-9ebe-0dff0a48e949	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
539b96cb-c786-46a3-86ea-fb3d182fb09e	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f529f24f-277d-440d-a4a5-4314d26b4d7e	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
b5df9194-f4f8-4bb4-bda7-988518986cf6	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
29d95c82-f5a1-49ea-9739-e2f061c5fa22	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6aba2fbb-d11c-4262-9f25-5a84e58124fb	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
258d0099-07db-4ada-981f-27a8c3b014ee	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
8447f109-d72c-42dd-80f8-e05828d63b90	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9d9013d0-43f6-4273-8779-e4f587349d1f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
4be83706-2c49-4b45-bfef-27b4e675b7d0	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9b1a3671-f47e-4106-8b01-3047aba72faa	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d8386127-cb2a-4f13-877a-8b5e46aa357c	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
4c77c271-e6d3-4782-a1a7-d53c0c9ba236	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c3bd91a7-6cfc-4134-86fe-1d086b93d39f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
853f65c1-5009-45af-83e6-2a186e7bc901	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
0e09bdd1-35e4-4183-a8e1-1af557f5c6fc	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
38d70d9d-5f84-4a0e-a2ab-09e493c51cdf	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d048d4f2-faa6-4332-a901-8be32dbad239	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
2db2c757-bcc6-461d-808c-e6015bba8f5b	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6f32c9eb-cfef-479e-a152-1b69ff91a599	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d4ebcbf6-020c-4a5f-bb49-9afe208b6563	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
a70a9b61-cc48-4800-8e52-49f28d2f725d	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
fdb4556c-ccee-4625-a79d-2534eb0ab8a6	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
82d4f5b7-4aa4-4a85-a0ab-0c3473ea7442	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
f95f2c5d-7f1e-4a02-b775-c300ac22549a	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
94b40f2f-3e9e-4afc-872b-3a7f76a89bda	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
abb882bd-e255-4dba-8b40-455b5706b636	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
1b2dbed5-218c-448d-8881-98f1f8f218fe	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
641c27bb-de6f-4b8c-9f69-ecfe76c07e9a	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
0ba3fe9a-600d-4623-b888-a7f21d2bb537	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
72b9ff4b-4a1c-4018-bab4-c32a698b8b4f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
20694269-7362-43f4-a46a-bdbb5674fa42	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
eee2c340-04ee-4892-af4a-1cf234849be2	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
bece78c6-c04c-4ebc-8996-2b72b83364e1	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
5eb1840e-7019-45ba-b360-bfaa4cabc815	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
180ff5a2-0961-4c31-932c-f907d1db2c23	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
e73e4904-2c23-4d4a-81e4-12703649a7ef	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
05432c86-d9db-4d48-a998-496ccac6eec8	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
5a431fb2-6184-4c29-a833-f29955ab593f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
70b65949-f12e-4f98-90ec-6935eb1a54fd	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
9e3a0e75-32e5-48e1-abe3-f9342aad7281	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
656d8e8f-bfbc-4227-bb77-457b4c748a49	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
650d2a90-7b65-41ea-a2b0-14373e4ab9b6	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
2557ff30-d953-4756-a537-a5edb6c6ebb9	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
449014e8-b9da-47b0-895e-c9997f29a94d	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
59c52076-eea4-4426-8caf-b90449b54ef6	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
cb2e6990-7057-4878-8680-5c9e735be0c9	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
75639ad6-9613-416d-b96a-7fb42200853e	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
90f1b664-cbd3-452e-af07-f0153099585f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
4574b029-c824-44a4-901d-d379417eeac1	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
fcd8cbc1-faaa-4f19-a1c1-141843169e9b	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
0a71e575-0eec-441d-b9f9-6e6c0eb27bc2	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
43eafcab-9226-459b-9b8c-f7047c8f928f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c9fc718f-783e-4ced-aa60-fd6dea910121	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
515e40fe-d9ea-460a-b80f-972986b14321	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
83af13c0-57b1-4f93-89db-bb9957a20bda	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
fac964f1-d155-4869-a9b6-5b33e57d6c43	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6bb7b473-85f6-461b-9aa7-f54fc8d588ef	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
84e95a1f-d014-4b73-9d68-644354f2449f	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
090fd818-960a-45d0-9dda-4428f33eaf95	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
db6374cf-42b7-4e4a-9fe0-a3807ff8912a	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d5d10e33-64d2-4089-b837-93a14c4ea011	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
deac1459-3425-4ca4-a435-48784d8b6970	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
320b519a-92ec-4892-ade0-04f6c09cb4d2	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
e99ee470-026a-4756-9bf3-a812b06dec69	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
700331c0-73b6-476f-bd90-3ee341a76b62	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
7fb29c17-e239-4d84-ab6f-7e7b3a2adaa9	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f6eb0299-9b64-4a8e-937d-b4af44b3f5c8	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
62f0f93b-1411-4b0c-bbc0-59aebb7cdf54	f5daa727-3824-49e1-b231-06724a7a2fdd	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f7512879-e897-4020-9887-a96a6226e1aa	97ab9597-0b6d-4b46-9ea8-0feed92eaf56	2026-07-08 17:56:30.457735+00	2026-07-08 17:56:30.457735+00	\N
\.


--
-- TOC entry 4286 (class 0 OID 16405)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: english_center_app
--

COPY public.users (id, full_name, email, phone, password_hash, avatar_url, status, is_verified, created_at, updated_at, deleted_at) FROM stdin;
211b0f76-c8e8-4dad-9827-155efeca5f1d	System Admin	admin@example.com	\N	$pbkdf2-sha256$29000$8T6nFGIMIUTovdd6D4Fwjg$/5/YTACiHKlUzy8cOurX4xDGZxO5OQ9LLF1ajS5Qpfw	avatars/352a9a42-9ae5-4786-a849-3a31303ef006/59f89ef300184f40a9e6d29ae9e66581.png	active	t	2026-07-08 16:40:31.692732+00	2026-07-08 17:49:10.142067+00	\N
e270724d-7e71-44b5-aefb-59bba9ff1007	Huynh Dang Khoa	huynhdangkhoa.work@gmail.com	+84767096431	$pbkdf2-sha256$29000$HaN0TqlVSqn1/l/rnZPy/g$XPHhbhmmnI/eCLvVgFlKyrBoYg6KibjDH8pzLyQ42hE	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f3a96be0-f34d-4df8-82c6-03b39db75217	Văn C	nguyenvanc@gmail.com	0123456789	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c30d60ca-1563-415f-8be2-79a732642ee9	Nguyễn Hoàng Minh	hoangminh.nguyen@gmail.com	0912345678	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d8d8a411-0d3c-4e26-ac64-6931a3db7e1d	Trần Trần Thu Thảo	thuthao.tran@gmail.com	0987654321	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/thuthao_02.png	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f813b900-72a7-415d-9ebe-0dff0a48e949	Phạm Minh Đức	minhduc.pham@gmail.com	0905123456	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
539b96cb-c786-46a3-86ea-fb3d182fb09e	Lê Gia Bảo	giabao.le@gmail.com	0934567890	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f529f24f-277d-440d-a4a5-4314d26b4d7e	Vũ Thị Ngọc Mai	ngocmai.vu@gmail.com	0945678901	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/ngocmai_05.png	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
b5df9194-f4f8-4bb4-bda7-988518986cf6	Đặng Anh Tuấn	anhtuan.dang@gmail.com	0976543210	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
29d95c82-f5a1-49ea-9739-e2f061c5fa22	Bùi Khánh Linh	khanhlinh.bui@gmail.com	0961234567	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6aba2fbb-d11c-4262-9f25-5a84e58124fb	Hoàng Tiến Đạt	tiendat.hoang@gmail.com	0923456789	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
258d0099-07db-4ada-981f-27a8c3b014ee	Đỗ Thúy Quỳnh	thuyquynh.do@gmail.com	0919876543	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/thuyquynh_09.png	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
8447f109-d72c-42dd-80f8-e05828d63b90	Ngô Quốc Khánh	quockhanh.ngo@gmail.com	0956789012	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	inactive	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9d9013d0-43f6-4273-8779-e4f587349d1f	Phan Thị Hồng Nhung	hongnhung.phan@gmail.com	0981122334	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
4be83706-2c49-4b45-bfef-27b4e675b7d0	Dương Văn Nam	vannam.duong@gmail.com	0903344556	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9b1a3671-f47e-4106-8b01-3047aba72faa	Lý Mỹ Tâm	mytam.ly@gmail.com	0914455667	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/mytam_13.png	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d8386127-cb2a-4f13-877a-8b5e46aa357c	Vũ Hoàng Long	hoanglong.vu@gmail.com	0975566778	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
4c77c271-e6d3-4782-a1a7-d53c0c9ba236	Trịnh Kim Ngân	kimngan.trinh@gmail.com	0966677889	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
c3bd91a7-6cfc-4134-86fe-1d086b93d39f	Lâm Bảo Lâm	baolam.lam@gmail.com	0937788990	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
853f65c1-5009-45af-83e6-2a186e7bc901	Nguyễn Thùy Dương	thuyduong.nguyen@gmail.com	0948899001	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/thuyduong_17.png	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
0e09bdd1-35e4-4183-a8e1-1af557f5c6fc	Mai Anh Tú	anhtu.mai@gmail.com	0919900112	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
38d70d9d-5f84-4a0e-a2ab-09e493c51cdf	Lê Thị Phương Thảo	phuongthao.le@gmail.com	0982211443	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d048d4f2-faa6-4332-a901-8be32dbad239	Quách Minh Triết	minhtriet.quach@gmail.com	0907766554	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
2db2c757-bcc6-461d-808c-e6015bba8f5b	Phạm Hải Yến	haiyen.pham@gmail.com	0931234567	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
6f32c9eb-cfef-479e-a152-1b69ff91a599	Trần Việt Hoàng	viethoang.tran@gmail.com	0962345678	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/viethoang_22.png	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
d4ebcbf6-020c-4a5f-bb49-9afe208b6563	Lê Thu Quỳnh	thuquynh.le@gmail.com	0973456789	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
a70a9b61-cc48-4800-8e52-49f28d2f725d	Nguyễn Minh Quân	minhquan.nguyen@gmail.com	0944567890	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
8eac94e2-8b88-47a2-a63d-388fa488db49	Sample Teacher	teacher@example.com	\N	$pbkdf2-sha256$29000$yDnHmNOa07qXcs7Zew9hjA$xBGLqmq55Qx1jDHyXOcwdJL.az2afLdpyF0qayEog.I	\N	active	t	2026-07-08 16:40:31.692732+00	2026-07-08 17:50:51.984638+00	\N
fdb4556c-ccee-4625-a79d-2534eb0ab8a6	Hoàng Minh Ánh	minhanh.hoang@gmail.com	0915678901	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
82d4f5b7-4aa4-4a85-a0ab-0c3473ea7442	Nguyễn Văn B	nguyenvanb@gmail.com	0123456789	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/4899cc659af7404387ea09e8da66b1bc.png	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
f95f2c5d-7f1e-4a02-b775-c300ac22549a	Bùi Đức Thắng	ducthang.bui@gmail.com	0926789012	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	inactive	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
94b40f2f-3e9e-4afc-872b-3a7f76a89bda	Trần Thị Minh Anh	minhanh.tran@gmail.com	0912345678	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/ta_minhanh_01.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
abb882bd-e255-4dba-8b40-455b5706b636	Đặng Khánh Huyền	khanhhuyen.dang@gmail.com	0983344556	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
1b2dbed5-218c-448d-8881-98f1f8f218fe	Lê Hoàng Nam	nam.lehoang@gmail.com	0987654321	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/lh_nam_02.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
0ba3fe9a-600d-4623-b888-a7f21d2bb537	Phạm Thanh Hằng	hang.phamthanh@gmail.com	0905123456	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
20694269-7362-43f4-a46a-bdbb5674fa42	Nguyễn Minh Triết	triet.nguyenminh@gmail.com	0934567890	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/nm_triet_04.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
bece78c6-c04c-4ebc-8996-2b72b83364e1	Vũ Thu Thảo	thao.vuthu@gmail.com	0945678901	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
180ff5a2-0961-4c31-932c-f907d1db2c23	Đặng Đình Quân	quan.dangdinh@gmail.com	0976543210	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/dd_quan_06.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
05432c86-d9db-4d48-a998-496ccac6eec8	Bùi Mai Phương	phuong.buimai@gmail.com	0961234567	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/bm_phuong_07.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
70b65949-f12e-4f98-90ec-6935eb1a54fd	Đỗ Hoàng Long	long.dohoang@gmail.com	0919876543	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
656d8e8f-bfbc-4227-bb77-457b4c748a49	Hoàng Ngọc Linh	linh.hoangngoc@gmail.com	0923456789	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/hn_linh_09.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
2557ff30-d953-4756-a537-a5edb6c6ebb9	Ngô Tiến Dũng	dung.ngotien@gmail.com	0956789012	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	inactive	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
59c52076-eea4-4426-8caf-b90449b54ef6	Phan Mỹ Linh	linh.phanmy@gmail.com	0981122334	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/pm_linh_11.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
75639ad6-9613-416d-b96a-7fb42200853e	Dương Quốc Bảo	bao.duongquoc@gmail.com	0903344556	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
4574b029-c824-44a4-901d-d379417eeac1	Lý Thu Hà	ha.lythu@gmail.com	0914455667	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/lt_ha_13.png	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
0a71e575-0eec-441d-b9f9-6e6c0eb27bc2	Vũ Minh Khôi	khoi.vuminh@gmail.com	0975566778	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/vm_khoi_14.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
c9fc718f-783e-4ced-aa60-fd6dea910121	Trịnh Thúy Vy	vy.trinhthuy@gmail.com	0966677889	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
83af13c0-57b1-4f93-89db-bb9957a20bda	Lâm Thành Đạt	dat.lamthanh@gmail.com	0937788990	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/lt_dat_16.png	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
6bb7b473-85f6-461b-9aa7-f54fc8d588ef	Nguyễn Hải Yến	yen.nguyenhai@gmail.com	0948899001	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
090fd818-960a-45d0-9dda-4428f33eaf95	Mai Xuân Trường	truong.maixuan@gmail.com	0919900112	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/mx_truong_18.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
d5d10e33-64d2-4089-b837-93a14c4ea011	Lê Thị Hồng Nhung	nhung.lethihong@gmail.com	0982211443	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	\N	active	f	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
320b519a-92ec-4892-ade0-04f6c09cb4d2	Quách Gia Bình	binh.quachgia@gmail.com	0907766554	$pbkdf2-sha256$29000$LCVE6F3LmVOqlXKOMWaMkQ$d/PqlYYiMsJrRdd6oHWk3preDDROQ6Ln3TzocMv.Bq0	avatars/teachers/qg_binh_20.png	active	t	2026-07-08 17:50:51.984638+00	2026-07-08 17:50:51.984638+00	\N
641c27bb-de6f-4b8c-9f69-ecfe76c07e9a	Nguyễn Hữu Đạt	huudat.nguyen@gmail.com	0904455667	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
72b9ff4b-4a1c-4018-bab4-c32a698b8b4f	Vũ Thu Trang	thutrang.vu@gmail.com	0915566778	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	avatars/students/thutrang_29.png	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
eee2c340-04ee-4892-af4a-1cf234849be2	Đỗ Tấn Phát	tanphat.do@gmail.com	0966677880	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
5eb1840e-7019-45ba-b360-bfaa4cabc815	Phan Ngọc Diệp	ngocdiep.phan@gmail.com	0937788991	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
e73e4904-2c23-4d4a-81e4-12703649a7ef	Dương Bảo Long	baolong.duong@gmail.com	0948899002	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
5a431fb2-6184-4c29-a833-f29955ab593f	Lý Thanh Thảo	thanhthao.ly@gmail.com	0919900113	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
9e3a0e75-32e5-48e1-abe3-f9342aad7281	Trần Quốc Tiến	quoctien.tran@gmail.com	0982211444	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
650d2a90-7b65-41ea-a2b0-14373e4ab9b6	Nguyễn Bích Phương	bichphuong.nguyen@gmail.com	0907766555	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
449014e8-b9da-47b0-895e-c9997f29a94d	Hoàng Quốc Việt	quocviet.hoang@gmail.com	0931234568	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
cb2e6990-7057-4878-8680-5c9e735be0c9	Bùi Thị Tuyết	thituyet.bui@gmail.com	0962345679	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
90f1b664-cbd3-452e-af07-f0153099585f	Đặng Minh Tuấn	minhtuan.dang@gmail.com	0973456790	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
fcd8cbc1-faaa-4f19-a1c1-141843169e9b	Nguyễn Diệu Linh	dieulinh.nguyen@gmail.com	0944567891	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	inactive	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
43eafcab-9226-459b-9b8c-f7047c8f928f	Vũ Minh Quân	minhquan.vu@gmail.com	0915678902	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
515e40fe-d9ea-460a-b80f-972986b14321	Đỗ Mai Chi	maichi.do@gmail.com	0926789013	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
fac964f1-d155-4869-a9b6-5b33e57d6c43	Phan Tiến Đạt	tiendat.phan@gmail.com	0983344557	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
84e95a1f-d014-4b73-9d68-644354f2449f	Dương Thùy Linh	thuylinh.duong@gmail.com	0904455668	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
db6374cf-42b7-4e4a-9fe0-a3807ff8912a	Lý Hoàng Yến	hoangyen.ly@gmail.com	0915566779	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
deac1459-3425-4ca4-a435-48784d8b6970	Trần Hải Nam	hainam.tran@gmail.com	0966677882	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
e99ee470-026a-4756-9bf3-a812b06dec69	Nguyễn Khánh An	khanhan.nguyen@gmail.com	0937788992	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
700331c0-73b6-476f-bd90-3ee341a76b62	Hoàng Xuân Trường	xuantruong.hoang@gmail.com	0948899003	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
7fb29c17-e239-4d84-ab6f-7e7b3a2adaa9	Bùi Minh Hằng	minhhang.bui@gmail.com	0919900115	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f6eb0299-9b64-4a8e-937d-b4af44b3f5c8	Đặng Quốc Bảo	quocbao.dang@gmail.com	0982211445	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	t	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
62f0f93b-1411-4b0c-bbc0-59aebb7cdf54	Nguyễn Quỳnh Chi	quynhchi.nguyen@gmail.com	0907766556	$pbkdf2-sha256$29000$YkzJOSdEyFkrxZgzphSCsA$YC7lJcNtwbF4m4vjaW8Nxv/reolw99dQB41fITTl5eA	\N	active	f	2026-07-08 17:49:33.743688+00	2026-07-08 17:49:33.743688+00	\N
f7512879-e897-4020-9887-a96a6226e1aa	dd	teacher1@example.com	\N	$pbkdf2-sha256$29000$kbI2RiglBMBYK4XwnrPW.g$NgtNd2RqaVWYk3YO4ZwNN6uW7/C1uSJXpS1KRLYNzus	\N	active	f	2026-07-08 17:56:30.457735+00	2026-07-08 17:56:30.457735+00	\N
\.


--
-- TOC entry 3963 (class 2606 OID 17529)
-- Name: agent_states agent_states_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.agent_states
    ADD CONSTRAINT agent_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3760 (class 2606 OID 16397)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 3942 (class 2606 OID 17397)
-- Name: assignment_attachments assignment_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3956 (class 2606 OID 17493)
-- Name: assignment_grades assignment_grades_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_pkey PRIMARY KEY (id);


--
-- TOC entry 3958 (class 2606 OID 17495)
-- Name: assignment_grades assignment_grades_submission_id_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_submission_id_key UNIQUE (submission_id);


--
-- TOC entry 3990 (class 2606 OID 17722)
-- Name: assignment_question_options assignment_question_options_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_question_options
    ADD CONSTRAINT assignment_question_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3986 (class 2606 OID 17704)
-- Name: assignment_questions assignment_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_questions
    ADD CONSTRAINT assignment_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3945 (class 2606 OID 17434)
-- Name: assignment_submissions assignment_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3980 (class 2606 OID 17674)
-- Name: assignment_types assignment_types_code_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_types
    ADD CONSTRAINT assignment_types_code_key UNIQUE (code);


--
-- TOC entry 3982 (class 2606 OID 17672)
-- Name: assignment_types assignment_types_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_types
    ADD CONSTRAINT assignment_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3934 (class 2606 OID 17355)
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3926 (class 2606 OID 17286)
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- TOC entry 3843 (class 2606 OID 16808)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3840 (class 2606 OID 16792)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4024 (class 2606 OID 17900)
-- Name: chat_message_attachments chat_message_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_message_attachments
    ADD CONSTRAINT chat_message_attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 4019 (class 2606 OID 17878)
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4033 (class 2606 OID 17959)
-- Name: chat_session_messages chat_session_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_session_messages
    ADD CONSTRAINT chat_session_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4027 (class 2606 OID 17929)
-- Name: class_schedules class_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 4005 (class 2606 OID 17800)
-- Name: class_sessions_media class_sessions_media_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions_media
    ADD CONSTRAINT class_sessions_media_pkey PRIMARY KEY (id);


--
-- TOC entry 3918 (class 2606 OID 17239)
-- Name: class_sessions class_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3911 (class 2606 OID 17194)
-- Name: class_students class_students_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_pkey PRIMARY KEY (id);


--
-- TOC entry 3901 (class 2606 OID 17157)
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- TOC entry 4013 (class 2606 OID 17844)
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 4009 (class 2606 OID 17830)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 3791 (class 2606 OID 16552)
-- Name: course_categories course_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_categories
    ADD CONSTRAINT course_categories_name_key UNIQUE (name);


--
-- TOC entry 3793 (class 2606 OID 16550)
-- Name: course_categories course_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_categories
    ADD CONSTRAINT course_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3795 (class 2606 OID 16554)
-- Name: course_categories course_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_categories
    ADD CONSTRAINT course_categories_slug_key UNIQUE (slug);


--
-- TOC entry 3889 (class 2606 OID 17080)
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 3974 (class 2606 OID 17564)
-- Name: course_media course_media_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_media
    ADD CONSTRAINT course_media_pkey PRIMARY KEY (id);


--
-- TOC entry 3828 (class 2606 OID 16695)
-- Name: course_modules course_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_pkey PRIMARY KEY (id);


--
-- TOC entry 3826 (class 2606 OID 16673)
-- Name: course_outcomes course_outcomes_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_pkey PRIMARY KEY (id);


--
-- TOC entry 3824 (class 2606 OID 16658)
-- Name: course_requirements course_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_requirements
    ADD CONSTRAINT course_requirements_pkey PRIMARY KEY (id);


--
-- TOC entry 3820 (class 2606 OID 16636)
-- Name: course_tag_mappings course_tag_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT course_tag_mappings_pkey PRIMARY KEY (id);


--
-- TOC entry 3799 (class 2606 OID 16567)
-- Name: course_tags course_tags_name_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_name_key UNIQUE (name);


--
-- TOC entry 3801 (class 2606 OID 16565)
-- Name: course_tags course_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3803 (class 2606 OID 16569)
-- Name: course_tags course_tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_slug_key UNIQUE (slug);


--
-- TOC entry 3850 (class 2606 OID 16829)
-- Name: course_wishlists course_wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT course_wishlists_pkey PRIMARY KEY (id);


--
-- TOC entry 3807 (class 2606 OID 16603)
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);


--
-- TOC entry 3809 (class 2606 OID 16601)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3811 (class 2606 OID 16605)
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- TOC entry 4041 (class 2606 OID 17979)
-- Name: guest_enrollments guest_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.guest_enrollments
    ADD CONSTRAINT guest_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 3877 (class 2606 OID 16972)
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3869 (class 2606 OID 16952)
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- TOC entry 3871 (class 2606 OID 16950)
-- Name: invoices invoices_order_id_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_key UNIQUE (order_id);


--
-- TOC entry 3873 (class 2606 OID 16948)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 3838 (class 2606 OID 16765)
-- Name: lesson_materials lesson_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_pkey PRIMARY KEY (id);


--
-- TOC entry 3834 (class 2606 OID 16719)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 3970 (class 2606 OID 17549)
-- Name: media media_object_name_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_object_name_key UNIQUE (object_name);


--
-- TOC entry 3972 (class 2606 OID 17547)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- TOC entry 3867 (class 2606 OID 16915)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3860 (class 2606 OID 16888)
-- Name: orders orders_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_invoice_number_key UNIQUE (invoice_number);


--
-- TOC entry 3862 (class 2606 OID 16886)
-- Name: orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- TOC entry 3864 (class 2606 OID 16884)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3883 (class 2606 OID 17025)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3771 (class 2606 OID 16440)
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- TOC entry 3773 (class 2606 OID 16438)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3767 (class 2606 OID 16429)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 3769 (class 2606 OID 16427)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3897 (class 2606 OID 17124)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3887 (class 2606 OID 17053)
-- Name: sepay_ipn_logs sepay_ipn_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.sepay_ipn_logs
    ADD CONSTRAINT sepay_ipn_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3787 (class 2606 OID 16528)
-- Name: staff_profiles staff_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.staff_profiles
    ADD CONSTRAINT staff_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3789 (class 2606 OID 16530)
-- Name: staff_profiles staff_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.staff_profiles
    ADD CONSTRAINT staff_profiles_user_id_key UNIQUE (user_id);


--
-- TOC entry 3779 (class 2606 OID 16495)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 3781 (class 2606 OID 16497)
-- Name: students students_user_id_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_key UNIQUE (user_id);


--
-- TOC entry 4001 (class 2606 OID 17758)
-- Name: submission_answer_media submission_answer_media_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answer_media
    ADD CONSTRAINT submission_answer_media_pkey PRIMARY KEY (id);


--
-- TOC entry 3995 (class 2606 OID 17737)
-- Name: submission_answers submission_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT submission_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 3954 (class 2606 OID 17464)
-- Name: submission_attachments submission_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_attachments
    ADD CONSTRAINT submission_attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3783 (class 2606 OID 16512)
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- TOC entry 3785 (class 2606 OID 16514)
-- Name: teachers teachers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_key UNIQUE (user_id);


--
-- TOC entry 3966 (class 2606 OID 17531)
-- Name: agent_states uq_agent_states_session_id; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.agent_states
    ADD CONSTRAINT uq_agent_states_session_id UNIQUE (session_id);


--
-- TOC entry 3951 (class 2606 OID 17436)
-- Name: assignment_submissions uq_assignment_submission_attempt; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT uq_assignment_submission_attempt UNIQUE (assignment_id, student_id, attempt_number);


--
-- TOC entry 3932 (class 2606 OID 17288)
-- Name: attendances uq_attendances_session_student; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT uq_attendances_session_student UNIQUE (session_id, student_id);


--
-- TOC entry 3848 (class 2606 OID 16810)
-- Name: cart_items uq_cart_items_cart_course; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT uq_cart_items_cart_course UNIQUE (cart_id, course_id);


--
-- TOC entry 4039 (class 2606 OID 17961)
-- Name: chat_session_messages uq_chat_session_messages_client_role; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_session_messages
    ADD CONSTRAINT uq_chat_session_messages_client_role UNIQUE (agent_state_id, role, client_message_id);


--
-- TOC entry 4031 (class 2606 OID 17931)
-- Name: class_schedules uq_class_schedule_time; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT uq_class_schedule_time UNIQUE (class_id, schedule_name, start_time, end_time);


--
-- TOC entry 3916 (class 2606 OID 17196)
-- Name: class_students uq_class_students_class_student; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT uq_class_students_class_student UNIQUE (class_id, student_id);


--
-- TOC entry 3909 (class 2606 OID 17159)
-- Name: classes uq_classes_code; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT uq_classes_code UNIQUE (code);


--
-- TOC entry 4017 (class 2606 OID 17846)
-- Name: conversation_participants uq_conversation_participants_conversation_user; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT uq_conversation_participants_conversation_user UNIQUE (conversation_id, user_id);


--
-- TOC entry 3893 (class 2606 OID 17082)
-- Name: course_enrollments uq_course_enrollments_user_course; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT uq_course_enrollments_user_course UNIQUE (user_id, course_id);


--
-- TOC entry 3978 (class 2606 OID 17566)
-- Name: course_media uq_course_media_course_media; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_media
    ADD CONSTRAINT uq_course_media_course_media UNIQUE (course_id, media_id);


--
-- TOC entry 3822 (class 2606 OID 16638)
-- Name: course_tag_mappings uq_course_tag_mapping; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT uq_course_tag_mapping UNIQUE (course_id, tag_id);


--
-- TOC entry 3854 (class 2606 OID 16831)
-- Name: course_wishlists uq_course_wishlists_user_course; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT uq_course_wishlists_user_course UNIQUE (user_id, course_id);


--
-- TOC entry 3777 (class 2606 OID 16464)
-- Name: role_permissions uq_role_permissions_role_permission; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT uq_role_permissions_role_permission PRIMARY KEY (role_id, permission_id);


--
-- TOC entry 3899 (class 2606 OID 17126)
-- Name: rooms uq_rooms_name; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT uq_rooms_name UNIQUE (name);


--
-- TOC entry 4003 (class 2606 OID 17760)
-- Name: submission_answer_media uq_submission_answer_media; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answer_media
    ADD CONSTRAINT uq_submission_answer_media UNIQUE (submission_answer_id, media_id);


--
-- TOC entry 3997 (class 2606 OID 17739)
-- Name: submission_answers uq_submission_answers_submission_question; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT uq_submission_answers_submission_question UNIQUE (submission_id, question_id);


--
-- TOC entry 3775 (class 2606 OID 16447)
-- Name: user_roles uq_user_roles_user_role; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT uq_user_roles_user_role PRIMARY KEY (user_id, role_id);


--
-- TOC entry 3763 (class 2606 OID 16417)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3765 (class 2606 OID 16415)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3964 (class 1259 OID 17532)
-- Name: ix_agent_states_session_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_agent_states_session_id ON public.agent_states USING btree (session_id);


--
-- TOC entry 3943 (class 1259 OID 17408)
-- Name: ix_assignment_attachments_assignment_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_attachments_assignment_id ON public.assignment_attachments USING btree (assignment_id);


--
-- TOC entry 3959 (class 1259 OID 17517)
-- Name: ix_assignment_grades_assignment_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_grades_assignment_id ON public.assignment_grades USING btree (assignment_id);


--
-- TOC entry 3960 (class 1259 OID 17518)
-- Name: ix_assignment_grades_student_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_grades_student_id ON public.assignment_grades USING btree (student_id);


--
-- TOC entry 3961 (class 1259 OID 17516)
-- Name: ix_assignment_grades_submission_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_grades_submission_id ON public.assignment_grades USING btree (submission_id);


--
-- TOC entry 3991 (class 1259 OID 17728)
-- Name: ix_assignment_question_options_question_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_question_options_question_id ON public.assignment_question_options USING btree (question_id);


--
-- TOC entry 3987 (class 1259 OID 17710)
-- Name: ix_assignment_questions_assignment_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_questions_assignment_id ON public.assignment_questions USING btree (assignment_id);


--
-- TOC entry 3988 (class 1259 OID 17711)
-- Name: ix_assignment_questions_question_type; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_questions_question_type ON public.assignment_questions USING btree (question_type);


--
-- TOC entry 3946 (class 1259 OID 17452)
-- Name: ix_assignment_submissions_assignment_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_submissions_assignment_id ON public.assignment_submissions USING btree (assignment_id);


--
-- TOC entry 3947 (class 1259 OID 17455)
-- Name: ix_assignment_submissions_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_submissions_status ON public.assignment_submissions USING btree (status);


--
-- TOC entry 3948 (class 1259 OID 17453)
-- Name: ix_assignment_submissions_student_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_submissions_student_id ON public.assignment_submissions USING btree (student_id);


--
-- TOC entry 3949 (class 1259 OID 17454)
-- Name: ix_assignment_submissions_user_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_submissions_user_id ON public.assignment_submissions USING btree (user_id);


--
-- TOC entry 3983 (class 1259 OID 17675)
-- Name: ix_assignment_types_code; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_assignment_types_code ON public.assignment_types USING btree (code);


--
-- TOC entry 3984 (class 1259 OID 17676)
-- Name: ix_assignment_types_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignment_types_status ON public.assignment_types USING btree (status);


--
-- TOC entry 3935 (class 1259 OID 17677)
-- Name: ix_assignments_assignment_type_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignments_assignment_type_id ON public.assignments USING btree (assignment_type_id);


--
-- TOC entry 3936 (class 1259 OID 17376)
-- Name: ix_assignments_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignments_class_id ON public.assignments USING btree (class_id);


--
-- TOC entry 3937 (class 1259 OID 17381)
-- Name: ix_assignments_due_at; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignments_due_at ON public.assignments USING btree (due_at);


--
-- TOC entry 3938 (class 1259 OID 17378)
-- Name: ix_assignments_lesson_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignments_lesson_id ON public.assignments USING btree (lesson_id);


--
-- TOC entry 3939 (class 1259 OID 17377)
-- Name: ix_assignments_session_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignments_session_id ON public.assignments USING btree (session_id);


--
-- TOC entry 3940 (class 1259 OID 17379)
-- Name: ix_assignments_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_assignments_status ON public.assignments USING btree (status);


--
-- TOC entry 3927 (class 1259 OID 17310)
-- Name: ix_attendances_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_attendances_class_id ON public.attendances USING btree (class_id);


--
-- TOC entry 3928 (class 1259 OID 17309)
-- Name: ix_attendances_session_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_attendances_session_id ON public.attendances USING btree (session_id);


--
-- TOC entry 3929 (class 1259 OID 17312)
-- Name: ix_attendances_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_attendances_status ON public.attendances USING btree (status);


--
-- TOC entry 3930 (class 1259 OID 17311)
-- Name: ix_attendances_student_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_attendances_student_id ON public.attendances USING btree (student_id);


--
-- TOC entry 3844 (class 1259 OID 16821)
-- Name: ix_cart_items_cart_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_cart_items_cart_id ON public.cart_items USING btree (cart_id);


--
-- TOC entry 3845 (class 1259 OID 17773)
-- Name: ix_cart_items_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_cart_items_class_id ON public.cart_items USING btree (class_id);


--
-- TOC entry 3846 (class 1259 OID 16822)
-- Name: ix_cart_items_course_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_cart_items_course_id ON public.cart_items USING btree (course_id);


--
-- TOC entry 3841 (class 1259 OID 16798)
-- Name: ix_carts_user_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_carts_user_id ON public.carts USING btree (user_id);


--
-- TOC entry 4025 (class 1259 OID 17906)
-- Name: ix_chat_message_attachments_message_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_message_attachments_message_id ON public.chat_message_attachments USING btree (message_id);


--
-- TOC entry 4020 (class 1259 OID 17889)
-- Name: ix_chat_messages_conversation_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_messages_conversation_id ON public.chat_messages USING btree (conversation_id);


--
-- TOC entry 4021 (class 1259 OID 17891)
-- Name: ix_chat_messages_message_type; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_messages_message_type ON public.chat_messages USING btree (message_type);


--
-- TOC entry 4022 (class 1259 OID 17890)
-- Name: ix_chat_messages_sender_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_messages_sender_id ON public.chat_messages USING btree (sender_id);


--
-- TOC entry 4034 (class 1259 OID 17970)
-- Name: ix_chat_session_messages_agent_state_created_at; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_session_messages_agent_state_created_at ON public.chat_session_messages USING btree (agent_state_id, created_at);


--
-- TOC entry 4035 (class 1259 OID 17967)
-- Name: ix_chat_session_messages_agent_state_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_session_messages_agent_state_id ON public.chat_session_messages USING btree (agent_state_id);


--
-- TOC entry 4036 (class 1259 OID 17969)
-- Name: ix_chat_session_messages_client_message_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_session_messages_client_message_id ON public.chat_session_messages USING btree (client_message_id);


--
-- TOC entry 4037 (class 1259 OID 17968)
-- Name: ix_chat_session_messages_role; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_chat_session_messages_role ON public.chat_session_messages USING btree (role);


--
-- TOC entry 4028 (class 1259 OID 17937)
-- Name: ix_class_schedules_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_schedules_class_id ON public.class_schedules USING btree (class_id);


--
-- TOC entry 4029 (class 1259 OID 17938)
-- Name: ix_class_schedules_schedule_name; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_schedules_schedule_name ON public.class_schedules USING btree (schedule_name);


--
-- TOC entry 3919 (class 1259 OID 17260)
-- Name: ix_class_sessions_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_class_id ON public.class_sessions USING btree (class_id);


--
-- TOC entry 3920 (class 1259 OID 17939)
-- Name: ix_class_sessions_class_schedule_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_class_schedule_id ON public.class_sessions USING btree (class_schedule_id);


--
-- TOC entry 4006 (class 1259 OID 17811)
-- Name: ix_class_sessions_media_class_session_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_media_class_session_id ON public.class_sessions_media USING btree (class_session_id);


--
-- TOC entry 4007 (class 1259 OID 17812)
-- Name: ix_class_sessions_media_media_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_media_media_id ON public.class_sessions_media USING btree (media_id);


--
-- TOC entry 3921 (class 1259 OID 17262)
-- Name: ix_class_sessions_room_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_room_id ON public.class_sessions USING btree (room_id);


--
-- TOC entry 3922 (class 1259 OID 17263)
-- Name: ix_class_sessions_session_date; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_session_date ON public.class_sessions USING btree (session_date);


--
-- TOC entry 3923 (class 1259 OID 17264)
-- Name: ix_class_sessions_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_status ON public.class_sessions USING btree (status);


--
-- TOC entry 3924 (class 1259 OID 17261)
-- Name: ix_class_sessions_teacher_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_sessions_teacher_id ON public.class_sessions USING btree (teacher_id);


--
-- TOC entry 3912 (class 1259 OID 17212)
-- Name: ix_class_students_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_students_class_id ON public.class_students USING btree (class_id);


--
-- TOC entry 3913 (class 1259 OID 17214)
-- Name: ix_class_students_enrollment_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_students_enrollment_status ON public.class_students USING btree (enrollment_status);


--
-- TOC entry 3914 (class 1259 OID 17213)
-- Name: ix_class_students_student_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_class_students_student_id ON public.class_students USING btree (student_id);


--
-- TOC entry 3902 (class 1259 OID 17173)
-- Name: ix_classes_class_type; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_classes_class_type ON public.classes USING btree (class_type);


--
-- TOC entry 3903 (class 1259 OID 17174)
-- Name: ix_classes_code; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_classes_code ON public.classes USING btree (code);


--
-- TOC entry 3904 (class 1259 OID 17170)
-- Name: ix_classes_course_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_classes_course_id ON public.classes USING btree (course_id);


--
-- TOC entry 3905 (class 1259 OID 17813)
-- Name: ix_classes_room_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_classes_room_id ON public.classes USING btree (room_id);


--
-- TOC entry 3906 (class 1259 OID 17172)
-- Name: ix_classes_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_classes_status ON public.classes USING btree (status);


--
-- TOC entry 3907 (class 1259 OID 17171)
-- Name: ix_classes_teacher_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_classes_teacher_id ON public.classes USING btree (teacher_id);


--
-- TOC entry 4014 (class 1259 OID 17857)
-- Name: ix_conversation_participants_conversation_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_conversation_participants_conversation_id ON public.conversation_participants USING btree (conversation_id);


--
-- TOC entry 4015 (class 1259 OID 17858)
-- Name: ix_conversation_participants_user_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_conversation_participants_user_id ON public.conversation_participants USING btree (user_id);


--
-- TOC entry 4010 (class 1259 OID 17837)
-- Name: ix_conversations_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_conversations_class_id ON public.conversations USING btree (class_id);


--
-- TOC entry 4011 (class 1259 OID 17836)
-- Name: ix_conversations_type; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_conversations_type ON public.conversations USING btree (type);


--
-- TOC entry 3796 (class 1259 OID 16555)
-- Name: ix_course_categories_name; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_categories_name ON public.course_categories USING btree (name);


--
-- TOC entry 3797 (class 1259 OID 16556)
-- Name: ix_course_categories_slug; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_categories_slug ON public.course_categories USING btree (slug);


--
-- TOC entry 3890 (class 1259 OID 17109)
-- Name: ix_course_enrollments_course_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_enrollments_course_id ON public.course_enrollments USING btree (course_id);


--
-- TOC entry 3891 (class 1259 OID 17108)
-- Name: ix_course_enrollments_user_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_enrollments_user_id ON public.course_enrollments USING btree (user_id);


--
-- TOC entry 3975 (class 1259 OID 17577)
-- Name: ix_course_media_course_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_media_course_id ON public.course_media USING btree (course_id);


--
-- TOC entry 3976 (class 1259 OID 17578)
-- Name: ix_course_media_media_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_media_media_id ON public.course_media USING btree (media_id);


--
-- TOC entry 3829 (class 1259 OID 17587)
-- Name: ix_course_modules_media_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_modules_media_id ON public.course_modules USING btree (media_id);


--
-- TOC entry 3804 (class 1259 OID 16570)
-- Name: ix_course_tags_name; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_tags_name ON public.course_tags USING btree (name);


--
-- TOC entry 3805 (class 1259 OID 16571)
-- Name: ix_course_tags_slug; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_tags_slug ON public.course_tags USING btree (slug);


--
-- TOC entry 3851 (class 1259 OID 16843)
-- Name: ix_course_wishlists_course_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_wishlists_course_id ON public.course_wishlists USING btree (course_id);


--
-- TOC entry 3852 (class 1259 OID 16842)
-- Name: ix_course_wishlists_user_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_course_wishlists_user_id ON public.course_wishlists USING btree (user_id);


--
-- TOC entry 3812 (class 1259 OID 17580)
-- Name: ix_courses_category_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_courses_category_id ON public.courses USING btree (category_id);


--
-- TOC entry 3813 (class 1259 OID 16607)
-- Name: ix_courses_code; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_courses_code ON public.courses USING btree (code);


--
-- TOC entry 3814 (class 1259 OID 17581)
-- Name: ix_courses_mode; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_courses_mode ON public.courses USING btree (mode);


--
-- TOC entry 3815 (class 1259 OID 16606)
-- Name: ix_courses_name; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_courses_name ON public.courses USING btree (name);


--
-- TOC entry 3816 (class 1259 OID 16608)
-- Name: ix_courses_slug; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_courses_slug ON public.courses USING btree (slug);


--
-- TOC entry 3817 (class 1259 OID 16609)
-- Name: ix_courses_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_courses_status ON public.courses USING btree (status);


--
-- TOC entry 3818 (class 1259 OID 17625)
-- Name: ix_courses_target_level; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_courses_target_level ON public.courses USING btree (target_level);


--
-- TOC entry 3878 (class 1259 OID 17785)
-- Name: ix_invoice_items_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_invoice_items_class_id ON public.invoice_items USING btree (class_id);


--
-- TOC entry 3874 (class 1259 OID 16964)
-- Name: ix_invoices_invoice_number; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_invoices_invoice_number ON public.invoices USING btree (invoice_number);


--
-- TOC entry 3875 (class 1259 OID 16963)
-- Name: ix_invoices_order_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_invoices_order_id ON public.invoices USING btree (order_id);


--
-- TOC entry 3835 (class 1259 OID 16776)
-- Name: ix_lesson_materials_lesson_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_lesson_materials_lesson_id ON public.lesson_materials USING btree (lesson_id);


--
-- TOC entry 3836 (class 1259 OID 17647)
-- Name: ix_lesson_materials_media_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_lesson_materials_media_id ON public.lesson_materials USING btree (media_id);


--
-- TOC entry 3830 (class 1259 OID 16735)
-- Name: ix_lessons_course_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_lessons_course_id ON public.lessons USING btree (course_id);


--
-- TOC entry 3831 (class 1259 OID 17641)
-- Name: ix_lessons_media_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_lessons_media_id ON public.lessons USING btree (media_id);


--
-- TOC entry 3832 (class 1259 OID 16736)
-- Name: ix_lessons_module_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_lessons_module_id ON public.lessons USING btree (module_id);


--
-- TOC entry 3967 (class 1259 OID 17990)
-- Name: ix_media_folder; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_media_folder ON public.media USING btree (folder);


--
-- TOC entry 3968 (class 1259 OID 17555)
-- Name: ix_media_object_name; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_media_object_name ON public.media USING btree (object_name);


--
-- TOC entry 3865 (class 1259 OID 17779)
-- Name: ix_order_items_class_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_order_items_class_id ON public.order_items USING btree (class_id);


--
-- TOC entry 3855 (class 1259 OID 16906)
-- Name: ix_orders_invoice_number; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_orders_invoice_number ON public.orders USING btree (invoice_number);


--
-- TOC entry 3856 (class 1259 OID 16905)
-- Name: ix_orders_order_code; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_orders_order_code ON public.orders USING btree (order_code);


--
-- TOC entry 3857 (class 1259 OID 16907)
-- Name: ix_orders_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_orders_status ON public.orders USING btree (status);


--
-- TOC entry 3858 (class 1259 OID 16904)
-- Name: ix_orders_user_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_orders_user_id ON public.orders USING btree (user_id);


--
-- TOC entry 3879 (class 1259 OID 17041)
-- Name: ix_payments_order_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_payments_order_id ON public.payments USING btree (order_id);


--
-- TOC entry 3880 (class 1259 OID 17043)
-- Name: ix_payments_provider_transaction_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_payments_provider_transaction_id ON public.payments USING btree (provider_transaction_id);


--
-- TOC entry 3881 (class 1259 OID 17042)
-- Name: ix_payments_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_payments_status ON public.payments USING btree (status);


--
-- TOC entry 3894 (class 1259 OID 17127)
-- Name: ix_rooms_name; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_rooms_name ON public.rooms USING btree (name);


--
-- TOC entry 3895 (class 1259 OID 17128)
-- Name: ix_rooms_status; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_rooms_status ON public.rooms USING btree (status);


--
-- TOC entry 3884 (class 1259 OID 17064)
-- Name: ix_sepay_ipn_logs_invoice_number; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_sepay_ipn_logs_invoice_number ON public.sepay_ipn_logs USING btree (invoice_number);


--
-- TOC entry 3885 (class 1259 OID 17065)
-- Name: ix_sepay_ipn_logs_sepay_transaction_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_sepay_ipn_logs_sepay_transaction_id ON public.sepay_ipn_logs USING btree (sepay_transaction_id);


--
-- TOC entry 3998 (class 1259 OID 17772)
-- Name: ix_submission_answer_media_media_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_submission_answer_media_media_id ON public.submission_answer_media USING btree (media_id);


--
-- TOC entry 3999 (class 1259 OID 17771)
-- Name: ix_submission_answer_media_submission_answer_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_submission_answer_media_submission_answer_id ON public.submission_answer_media USING btree (submission_answer_id);


--
-- TOC entry 3992 (class 1259 OID 17751)
-- Name: ix_submission_answers_question_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_submission_answers_question_id ON public.submission_answers USING btree (question_id);


--
-- TOC entry 3993 (class 1259 OID 17750)
-- Name: ix_submission_answers_submission_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_submission_answers_submission_id ON public.submission_answers USING btree (submission_id);


--
-- TOC entry 3952 (class 1259 OID 17475)
-- Name: ix_submission_attachments_submission_id; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE INDEX ix_submission_attachments_submission_id ON public.submission_attachments USING btree (submission_id);


--
-- TOC entry 3761 (class 1259 OID 16418)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: english_center_app
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4110 (class 2606 OID 17398)
-- Name: assignment_attachments assignment_attachments_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- TOC entry 4111 (class 2606 OID 17403)
-- Name: assignment_attachments assignment_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- TOC entry 4117 (class 2606 OID 17501)
-- Name: assignment_grades assignment_grades_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- TOC entry 4118 (class 2606 OID 17511)
-- Name: assignment_grades assignment_grades_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id);


--
-- TOC entry 4119 (class 2606 OID 17506)
-- Name: assignment_grades assignment_grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- TOC entry 4120 (class 2606 OID 17496)
-- Name: assignment_grades assignment_grades_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.assignment_submissions(id);


--
-- TOC entry 4125 (class 2606 OID 17723)
-- Name: assignment_question_options assignment_question_options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_question_options
    ADD CONSTRAINT assignment_question_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.assignment_questions(id);


--
-- TOC entry 4124 (class 2606 OID 17705)
-- Name: assignment_questions assignment_questions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_questions
    ADD CONSTRAINT assignment_questions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- TOC entry 4112 (class 2606 OID 17437)
-- Name: assignment_submissions assignment_submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- TOC entry 4113 (class 2606 OID 17442)
-- Name: assignment_submissions assignment_submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- TOC entry 4114 (class 2606 OID 17447)
-- Name: assignment_submissions assignment_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4105 (class 2606 OID 17356)
-- Name: assignments assignments_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4106 (class 2606 OID 17371)
-- Name: assignments assignments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4107 (class 2606 OID 17366)
-- Name: assignments assignments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- TOC entry 4108 (class 2606 OID 17361)
-- Name: assignments assignments_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.class_sessions(id);


--
-- TOC entry 4101 (class 2606 OID 17294)
-- Name: attendances attendances_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4102 (class 2606 OID 17304)
-- Name: attendances attendances_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- TOC entry 4103 (class 2606 OID 17289)
-- Name: attendances attendances_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.class_sessions(id);


--
-- TOC entry 4104 (class 2606 OID 17299)
-- Name: attendances attendances_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- TOC entry 4064 (class 2606 OID 16811)
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 4065 (class 2606 OID 16816)
-- Name: cart_items cart_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4063 (class 2606 OID 16793)
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4137 (class 2606 OID 17901)
-- Name: chat_message_attachments chat_message_attachments_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_message_attachments
    ADD CONSTRAINT chat_message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.chat_messages(id);


--
-- TOC entry 4135 (class 2606 OID 17879)
-- Name: chat_messages chat_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


--
-- TOC entry 4136 (class 2606 OID 17884)
-- Name: chat_messages chat_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 4139 (class 2606 OID 17962)
-- Name: chat_session_messages chat_session_messages_agent_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.chat_session_messages
    ADD CONSTRAINT chat_session_messages_agent_state_id_fkey FOREIGN KEY (agent_state_id) REFERENCES public.agent_states(id);


--
-- TOC entry 4138 (class 2606 OID 17932)
-- Name: class_schedules class_schedules_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4096 (class 2606 OID 17240)
-- Name: class_sessions class_sessions_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4097 (class 2606 OID 17250)
-- Name: class_sessions class_sessions_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- TOC entry 4130 (class 2606 OID 17801)
-- Name: class_sessions_media class_sessions_media_class_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions_media
    ADD CONSTRAINT class_sessions_media_class_session_id_fkey FOREIGN KEY (class_session_id) REFERENCES public.class_sessions(id);


--
-- TOC entry 4131 (class 2606 OID 17806)
-- Name: class_sessions_media class_sessions_media_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions_media
    ADD CONSTRAINT class_sessions_media_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id);


--
-- TOC entry 4098 (class 2606 OID 17255)
-- Name: class_sessions class_sessions_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 4099 (class 2606 OID 17245)
-- Name: class_sessions class_sessions_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- TOC entry 4093 (class 2606 OID 17197)
-- Name: class_students class_students_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4094 (class 2606 OID 17207)
-- Name: class_students class_students_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id);


--
-- TOC entry 4095 (class 2606 OID 17202)
-- Name: class_students class_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- TOC entry 4090 (class 2606 OID 17160)
-- Name: classes classes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4091 (class 2606 OID 17165)
-- Name: classes classes_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- TOC entry 4133 (class 2606 OID 17847)
-- Name: conversation_participants conversation_participants_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


--
-- TOC entry 4134 (class 2606 OID 17852)
-- Name: conversation_participants conversation_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4132 (class 2606 OID 17831)
-- Name: conversations conversations_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4085 (class 2606 OID 17093)
-- Name: course_enrollments course_enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4086 (class 2606 OID 17098)
-- Name: course_enrollments course_enrollments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4087 (class 2606 OID 17103)
-- Name: course_enrollments course_enrollments_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- TOC entry 4088 (class 2606 OID 17088)
-- Name: course_enrollments course_enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- TOC entry 4089 (class 2606 OID 17083)
-- Name: course_enrollments course_enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4122 (class 2606 OID 17567)
-- Name: course_media course_media_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_media
    ADD CONSTRAINT course_media_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4123 (class 2606 OID 17572)
-- Name: course_media course_media_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_media
    ADD CONSTRAINT course_media_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id);


--
-- TOC entry 4054 (class 2606 OID 16696)
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4053 (class 2606 OID 16674)
-- Name: course_outcomes course_outcomes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4052 (class 2606 OID 16659)
-- Name: course_requirements course_requirements_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_requirements
    ADD CONSTRAINT course_requirements_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4050 (class 2606 OID 16639)
-- Name: course_tag_mappings course_tag_mappings_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT course_tag_mappings_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4051 (class 2606 OID 16644)
-- Name: course_tag_mappings course_tag_mappings_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT course_tag_mappings_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.course_tags(id);


--
-- TOC entry 4067 (class 2606 OID 16837)
-- Name: course_wishlists course_wishlists_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT course_wishlists_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4068 (class 2606 OID 16832)
-- Name: course_wishlists course_wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT course_wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4109 (class 2606 OID 17678)
-- Name: assignments fk_assignments_assignment_type_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT fk_assignments_assignment_type_id FOREIGN KEY (assignment_type_id) REFERENCES public.assignment_types(id);


--
-- TOC entry 4066 (class 2606 OID 17774)
-- Name: cart_items fk_cart_items_class_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart_items_class_id FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4100 (class 2606 OID 17940)
-- Name: class_sessions fk_class_sessions_class_schedule_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT fk_class_sessions_class_schedule_id FOREIGN KEY (class_schedule_id) REFERENCES public.class_schedules(id);


--
-- TOC entry 4092 (class 2606 OID 17814)
-- Name: classes fk_classes_room_id_rooms; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT fk_classes_room_id_rooms FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- TOC entry 4055 (class 2606 OID 17588)
-- Name: course_modules fk_course_modules_media_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT fk_course_modules_media_id FOREIGN KEY (media_id) REFERENCES public.media(id);


--
-- TOC entry 4049 (class 2606 OID 17582)
-- Name: courses fk_courses_category_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT fk_courses_category_id FOREIGN KEY (category_id) REFERENCES public.course_categories(id);


--
-- TOC entry 4077 (class 2606 OID 17786)
-- Name: invoice_items fk_invoice_items_class_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT fk_invoice_items_class_id FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4060 (class 2606 OID 17648)
-- Name: lesson_materials fk_lesson_materials_media_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT fk_lesson_materials_media_id FOREIGN KEY (media_id) REFERENCES public.media(id);


--
-- TOC entry 4056 (class 2606 OID 17642)
-- Name: lessons fk_lessons_media_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT fk_lessons_media_id FOREIGN KEY (media_id) REFERENCES public.media(id);


--
-- TOC entry 4072 (class 2606 OID 17780)
-- Name: order_items fk_order_items_class_id; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_items_class_id FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- TOC entry 4078 (class 2606 OID 16978)
-- Name: invoice_items invoice_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4079 (class 2606 OID 16973)
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- TOC entry 4075 (class 2606 OID 16953)
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4076 (class 2606 OID 16958)
-- Name: invoices invoices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4061 (class 2606 OID 16771)
-- Name: lesson_materials lesson_materials_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4062 (class 2606 OID 16766)
-- Name: lesson_materials lesson_materials_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- TOC entry 4057 (class 2606 OID 16720)
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4058 (class 2606 OID 16730)
-- Name: lessons lessons_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4059 (class 2606 OID 16725)
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id);


--
-- TOC entry 4121 (class 2606 OID 17550)
-- Name: media media_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- TOC entry 4073 (class 2606 OID 16921)
-- Name: order_items order_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4074 (class 2606 OID 16916)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4069 (class 2606 OID 16899)
-- Name: orders orders_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 4070 (class 2606 OID 16894)
-- Name: orders orders_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- TOC entry 4071 (class 2606 OID 16889)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4080 (class 2606 OID 17031)
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- TOC entry 4081 (class 2606 OID 17026)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4082 (class 2606 OID 17036)
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4044 (class 2606 OID 16470)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- TOC entry 4045 (class 2606 OID 16465)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 4083 (class 2606 OID 17054)
-- Name: sepay_ipn_logs sepay_ipn_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.sepay_ipn_logs
    ADD CONSTRAINT sepay_ipn_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4084 (class 2606 OID 17059)
-- Name: sepay_ipn_logs sepay_ipn_logs_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.sepay_ipn_logs
    ADD CONSTRAINT sepay_ipn_logs_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- TOC entry 4048 (class 2606 OID 16531)
-- Name: staff_profiles staff_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.staff_profiles
    ADD CONSTRAINT staff_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4046 (class 2606 OID 16498)
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4128 (class 2606 OID 17766)
-- Name: submission_answer_media submission_answer_media_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answer_media
    ADD CONSTRAINT submission_answer_media_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id);


--
-- TOC entry 4129 (class 2606 OID 17761)
-- Name: submission_answer_media submission_answer_media_submission_answer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answer_media
    ADD CONSTRAINT submission_answer_media_submission_answer_id_fkey FOREIGN KEY (submission_answer_id) REFERENCES public.submission_answers(id);


--
-- TOC entry 4126 (class 2606 OID 17745)
-- Name: submission_answers submission_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT submission_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.assignment_questions(id);


--
-- TOC entry 4127 (class 2606 OID 17740)
-- Name: submission_answers submission_answers_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT submission_answers_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.assignment_submissions(id);


--
-- TOC entry 4115 (class 2606 OID 17465)
-- Name: submission_attachments submission_attachments_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_attachments
    ADD CONSTRAINT submission_attachments_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.assignment_submissions(id);


--
-- TOC entry 4116 (class 2606 OID 17470)
-- Name: submission_attachments submission_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.submission_attachments
    ADD CONSTRAINT submission_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- TOC entry 4047 (class 2606 OID 16515)
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4042 (class 2606 OID 16453)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 4043 (class 2606 OID 16448)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: english_center_app
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-07-10 12:03:05

--
-- PostgreSQL database dump complete
--

